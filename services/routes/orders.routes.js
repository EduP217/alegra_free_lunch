const express = require('express');
const router = express.Router();
const utilitaries = require('../utils/utils');

router.get('/', async (req, res) => {
    let warehouse = {};
    let orders = await utilitaries.readFromCSV('/data/orders.csv');
    let recipes = await utilitaries.readFromCSV('/data/recipes.csv');

    await orders.map(async o => {
        let recipe = utilitaries.getFilteredByKey(recipes, "id", o.recipe_id)[0];
        o["food"] = recipe.name;
        o["image"] = recipe.image;
        return o;
    });

    let ordersPending = utilitaries.getFilteredByKey(orders, "status", "0");
    let ordersPickup = utilitaries.getFilteredByKey(orders, "status", "1");
    let ordersHistory = utilitaries.getFilteredByKey(orders, "status", "2");

    warehouse["pending"] = ordersPending;
    warehouse["pick-up"] = ordersPickup;
    warehouse["history"] = ordersHistory;

    return res.status(200).json(warehouse);
});

router.post('/', async (req, res) => {
    let recipes = await utilitaries.readFromCSV('/data/recipes.csv');
    let recipesIngredients = await utilitaries.readFromCSV('/data/recipes-ingredients.csv');
    let ingredients = await utilitaries.readFromCSV('/data/ingredients.csv');

    let randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    let recipesIngredientsFiltered = utilitaries.getFilteredByKey(recipesIngredients, "recipe_id", randomRecipe.id);
    let ingredientsWithoutStock = false;

    await ingredients.map(async i => {
        if (!ingredientsWithoutStock) {
            await recipesIngredientsFiltered.forEach(ir => {
                if (i.id == ir.ingredient_id) {
                    let calculateReduceStock = i.stock - ir.quantity;
                    if (calculateReduceStock < 0) {
                        ingredientsWithoutStock = true;
                    } else if (calculateReduceStock == 0) {
                        i.stock = calculateReduceStock;
                        i.status = 0;
                    } else {
                        i.stock = calculateReduceStock;
                    }
                }
            });
        }
        return i;
    });

    let message = {};

    if (ingredientsWithoutStock) {
        message = {
            "message": `There are not enough ingredients to prepare the <b>'${randomRecipe.name}'</b>`
        };
    } else {
        console.log(ingredients);

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

        let orders = await utilitaries.readFromCSV('/data/orders.csv');
        let newId = `OR-${utilitaries.zeroPad(orders.length,3)}`;
        orders.push({
            "id": newId,
            "recipe_id": randomRecipe.id,
            "ordered": req.body.dateOrdered,
            "delivered": "",
            "status": "0"
        });

        let ordersOptions = [
            {key: 'id',header: 'id'},
            {key: 'recipe_id',header: 'recipe_id'},
            {key: 'ordered',header: 'ordered'},
            {key: 'delivered',header: 'delivered'},
            {key: 'status',header: 'status'}
        ];
        utilitaries.writeCSV('/data/orders.csv', ordersOptions, orders);

        message = {
            "message": `The order <b>${newId}</b> has been sent to the kitchen.`
        };
    }

    console.log(message);
    return res.status(201).send(message);
});

module.exports = router;