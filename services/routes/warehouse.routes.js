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
    let message = {
        "message": "Nothing to purchase yet."
    };
    //console.debug(emptyIngredients);
    if (emptyIngredients.length > 0) {
        const marketPlace = await utilitaries.getMarketPlaceBuy(emptyIngredients);
        //console.debug(marketPlace);
        message = {
            "message": "MarketPlace without purchasable stock."
        };
        if (marketPlace.length > 0) {
            let purchases = await utilitaries.readFromCSV('/data/purchase.csv');
            //console.debug(purchases);
            let newId = purchases.length;
            newId = `PI-${utilitaries.zeroPad(newId+1,3)}`;
            let newPurchase = {
                "id": newId,
                "purchased": req.body.datePurchased,
                "received": "",
                "status": "0"
            };
            purchases.push(newPurchase);

            let purchaseOptions = [{
                    key: 'id',
                    header: 'id'
                },
                {
                    key: 'purchased',
                    header: 'purchased'
                },
                {
                    key: 'received',
                    header: 'received'
                },
                {
                    key: 'status',
                    header: 'status'
                }
            ];
            utilitaries.writeCSV('/data/purchase.csv', purchaseOptions, purchases);

            let purchaseIngredients = await utilitaries.readFromCSV('/data/purchase-ingredients.csv');
            marketPlace.forEach(mp => {
                purchaseIngredients.push({
                    "purchase_id": newId,
                    "ingredient_id": mp.id
                });

                ingredients.map(i => {
                    if (i.id == mp.id) {
                        i.stock = mp.quantity;
                        i.status = 1;
                    }
                });
            });

            let purchaseIngredientsOptions = [{
                    key: 'purchase_id',
                    header: 'purchase_id'
                },
                {
                    key: 'ingredient_id',
                    header: 'ingredient_id'
                }
            ];
            utilitaries.writeCSV('/data/purchase-ingredients.csv', purchaseIngredientsOptions, purchaseIngredients);

            let ingredientsOptions = [{
                    key: 'id',
                    header: 'id'
                },
                {
                    key: 'name',
                    header: 'name'
                },
                {
                    key: 'stock',
                    header: 'stock'
                },
                {
                    key: 'status',
                    header: 'status'
                }
            ];
            utilitaries.writeCSV('/data/ingredients.csv', ingredientsOptions, ingredients);

            message = {
                "message": "Ingredients Purchased correctly."
            }
            return res.status(201).send(message);
        } else {
            return res.status(500).send(message);
        }
    }

    return res.status(500).send(message);
});

router.put('/:id', async (req, res) => {
    //console.log(req);
    let purchaseId = req.params.id;
    let updateStatus = req.body.updateStatus;
    let dateReceived = req.body.dateReceived;

    let purchases = await utilitaries.readFromCSV('/data/purchase.csv');
    await Promise.all(purchases.map(p => {
        if (p.id == purchaseId) {
            p.status = updateStatus;
            if (updateStatus == "2") {
                p.received = dateReceived;
            }
        }
    }));

    let purchaseOptions = [{
            key: 'id',
            header: 'id'
        },
        {
            key: 'purchased',
            header: 'purchased'
        },
        {
            key: 'received',
            header: 'received'
        },
        {
            key: 'status',
            header: 'status'
        }
    ];
    utilitaries.writeCSV('/data/purchase.csv', purchaseOptions, purchases);

    let message = {
        "message": `The puchase <b>${purchaseId}</b> has been updated.`
    };

    console.log(message);
    return res.status(200).send(message);
});

module.exports = router;