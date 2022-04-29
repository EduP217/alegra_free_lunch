function getData() {

    

    renderRecipes();
}

function renderRecipes() {
    const root = document.getElementById('recipes-cards-container');
    const template = document.querySelector('#reciperow');

    let item = template.content.cloneNode(true);
    root.appendChild(item);
}

getData();