async function init() {
    let recipes = await getData("recipes");
    renderRecipes(recipes);
}

function renderRecipes(list) {
    const root = document.getElementById('recipes-cards-container');
    const template = document.querySelector('#reciperow');

    for (const i of list) {
        let item = template.content.cloneNode(true);
        let itemImage = item.querySelector(".item-image");
        let itemName = item.querySelector(".item-name");
        let itemDescription = item.querySelector(".item-description");
        let itemCookTime = item.querySelector(".item-cook-time");

        itemImage.setAttribute("src",`${basepath}/assets/${i.image}`);
        itemImage.setAttribute("alt",i.name);
        itemName.innerHTML = i.name;

        let iDescription = `${i.description}<br><br> <b>Ingredients</b><br><ul>`;
        i["ingredients"].forEach(el => {
            iDescription += `<li>${el.quantity} ${el.name}</li>`;
        });
        iDescription += "</ul>";

        itemDescription.innerHTML = iDescription;
        itemCookTime.innerHTML = `Average cooking time of <b>${i["cook-time-min"]} min</b>`;
        root.appendChild(item);
    }    
}

init();