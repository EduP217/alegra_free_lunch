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
        //console.debug(ingredientsByPurchase);
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
    //console.debug(req.body);
    let ingredients = await utilitaries.readFromCSV('/data/ingredients.csv');
    let emptyIngredients = utilitaries.getFilteredByKey(ingredients, "status", 0);
    //console.debug(emptyIngredients);
    if (emptyIngredients.length > 0) {
        const marketPlace = await utilitaries.getMarketPlaceBuy(emptyIngredients);
        //console.debug(marketPlace);
        if (marketPlace.length > 0) {
            let purchases = await utilitaries.readFromCSV('/data/purchase.csv');
            //console.debug(purchases);
            let newId = purchases.length;
            newId = `PI-${utilitaries.zeroPad(newId,3)}`;
            let newPurchase = {
                "id": newId,
                "purchased": req.body.datePurchased,
                "received": "",
                "status": "0"
            };
            purchases.push(newPurchase);

            let purchaseOptions = [
                {key: 'id',header: 'id'},
                {key: 'purchased',header: 'purchased'},
                {key: 'received',header: 'received'},
                {key: 'status',header: 'status'}
            ];
            utilitaries.writeCSV('/data/purchase.csv', purchaseOptions, purchases);
            
            let purchaseIngredients = await utilitaries.readFromCSV('/data/purchase-ingredients.csv');
            marketPlace.forEach(mp => {
                purchaseIngredients.push({"purchase_id":newId,"ingredient_id":mp.id});
                
                ingredients.map(i => {
                    if(i.id == mp.id){
                        i.stock = mp.quantity;
                        i.status = 1;
                    }
                });
            });

            let purchaseIngredientsOptions = [
                {key: 'purchase_id',header: 'purchase_id'},
                {key: 'ingredient_id',header: 'ingredient_id'}
            ];
            utilitaries.writeCSV('/data/purchase-ingredients.csv', purchaseIngredientsOptions, purchaseIngredients);

            let ingredientsOptions = [
                {key: 'id',header: 'id'},
                {key: 'name',header: 'name'},
                {key: 'stock',header: 'stock'},
                {key: 'status',header: 'status'}
            ];
            utilitaries.writeCSV('/data/ingredients.csv', ingredientsOptions, ingredients);
        }
    }

    return res.status(201).send({});
});

module.exports = router;