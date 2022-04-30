const express = require('express');
const router = express.Router();
const utilitaries = require('../utils/utils');

router.get('/', async (req, res) => {
    let recipes = await utilitaries.readFromCSV('/data/recipes.csv');
    let ingredients = await utilitaries.readFromCSV('/data/ingredients.csv');
    let recipeIngredients = await utilitaries.readFromCSV('/data/recipes-ingredients.csv');

    await recipes.map(async r => {
        let recipeIngredientsFiltered = utilitaries.getFilteredByKey(recipeIngredients, "recipe_id", r.id);
        let ingredientsByRecipe = [];
        //console.log(ingredientsByRecipe);
        await recipeIngredientsFiltered.forEach(ir => {
            let ingredient = utilitaries.getFilteredByKey(ingredients, "id", ir.ingredient_id)[0];
            ingredientsByRecipe.push({"id": ir.ingredient_id,"name": ingredient.name,"quantity": ir.quantity});
        });

        r["ingredients"] = ingredientsByRecipe;
        return r;
    })

    return res.status(200).json(recipes);
});

module.exports = router;