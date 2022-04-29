async function init() {
    let warehouse = await getData("data/warehouse.json");
    renderWarehouse(warehouse.ingredients);
    renderPurchaseHistory(warehouse.purchase);
}

function renderWarehouse(list) {
    const tbody = document.querySelector('#table-warehouse tbody');
    const template = document.querySelector('#item-table-ingredients');
    for (const i of list) {
        let item = template.content.cloneNode(true);
        let itemId = item.querySelector("th");
        let itemCol = item.querySelectorAll("td");

        itemId.innerHTML = i.id;
        itemCol[0].innerHTML = i.name;
        itemCol[1].innerHTML = i.stock;
        itemCol[2].innerHTML = i.status;

        tbody.appendChild(item);
    }
}

function renderPurchaseHistory(list) {
    const root = document.getElementById('list-purchase-history');
    const template = document.querySelector('#item-purchase-history');

    for (const i of list) {
        let item = template.content.cloneNode(true);
        let itemPurchased = item.querySelector(".item-purchased");
        let itemReceived = item.querySelector(".item-received");
        let itemDescription = item.querySelector(".item-description");
        let itemStatus = item.querySelector(".item-status");

        itemPurchased.innerHTML = `P: ${i.purchased}`;
        itemReceived.innerHTML = `R: ${i.received}`;
        itemStatus.innerHTML = i.status;

        let iDescription = [];
        i.ingredients.forEach(el => {
            iDescription.push(el.name);
        });

        itemDescription.innerHTML = iDescription.join(", ");

        root.appendChild(item);
    }
}


init();