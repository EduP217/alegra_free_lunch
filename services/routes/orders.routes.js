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

module.exports = router;