const express = require('express');
const router = express.Router();
const utilitaries = require('../utils/utils');

router.get('/', async (req, res) => {
    let warehouse = {};
    let ingredients = await utilitaries.readFromCSV('/data/ingredients.csv');
    let purchase = await utilitaries.readFromCSV('/data/purchase.csv');
    let purchaseIngredients = await utilitaries.readFromCSV('/data/purchase-ingredients.csv');

    await purchase.map(async p => {
        let purchaseIngredientsFiltered = utilitaries.getFilteredByKey(purchaseIngredients, "purchase_id", p.id);
        let ingredientsByPurchase = [];
        //console.log(ingredientsByPurchase);
        await purchaseIngredientsFiltered.forEach(pi => {
            let ingredient = utilitaries.getFilteredByKey(ingredients, "id", pi.ingredient_id)[0];
            ingredientsByPurchase.push({
                "id": pi.ingredient_id,
                "name": ingredient.name
            });
        });

        p["ingredients"] = ingredientsByPurchase;
        return p;
    });

    warehouse["ingredients"] = ingredients;
    warehouse["purchase"] = purchase;

    return res.status(200).json(warehouse);
});

router.post('/', async (req, res) => {
    let ingredients = await utilitaries.readFromCSV('/data/ingredients.csv');
    let emptyIngredients = utilitaries.getFilteredByKey(ingredients, "status", 0);
    if (emptyIngredients.length > 0) {
        const marketPlace = await utilitaries.getMarketPlaceBuy(emptyIngredients);
        if (marketPlace.length > 0) {
            let purchases = await utilitaries.readFromCSV('/data/purchase.csv');
            let newId = purchases.length;
            newId = `PI-${utilitaries.zeroPad(newId,3)}`;
            let newPurchase = {
                "id": newId,
                "purchased": req.datePurchased,
                "received": "",
                "status": "0"
            };
            purchases.push(newPurchase);

            let purchaseOptions = [
                {id: 'id',title: 'id'},
                {id: 'purchased',title: 'purchased'},
                {id: 'received',title: 'received'},
                {id: 'status',title: 'status'}
            ];
            utilitaries.writeCSV('/data/purchase.csv', purchaseOptions, purchases);
            
            let purchaseIngredients = await utilitaries.readFromCSV('/data/purchase-ingredients.csv');
            marketPlace.forEach(mp => {
                purchaseIngredients.push({"purchase_id":newId,"ingredient_id":mp.id});
                
                emptyIngredients.map(i => {
                    if(i.id == mp.id){
                        i.stock = mp.quantity;
                        i.status = 1;
                    }
                });
            });

            let purchaseIngredientsOptions = [
                {id: 'purchase_id',title: 'purchase_id'},
                {id: 'ingredient_id',title: 'ingredient_id'}
            ];
            utilitaries.writeCSV('/data/purchase-ingredients.csv', purchaseIngredientsOptions, purchaseIngredients);

            ingredients = ingredients.concat(emptyIngredients);

            let ingredientsOptions = [
                {id: 'id',title: 'id'},
                {id: 'name',title: 'name'},
                {id: 'stock',title: 'stock'},
                {id: 'status',title: 'status'}
            ];
            utilitaries.writeCSV('/data/ingredients.csv', ingredientsOptions, purchaseIngredients);
        }
    }

    return res.status(201);
});

module.exports = router;