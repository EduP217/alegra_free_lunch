async function init() {
    /*let warehouse = await getData("data/warehouse.json");
    renderWarehouse(warehouse.ingredients);
    renderPurchaseHistory(warehouse.purchase);*/
    renderPurchaseHistory()
}

function renderWarehouse(list) {
    const tbody = document.querySelector('#table-warehouse tbody');
    const template = document.querySelector('#item-table-ingredients');

    let item = template.content.cloneNode(true);
    tbody.appendChild(item);
}

function renderPurchaseHistory(list) {
    const root = document.getElementById('list-purchase-history');
    const template = document.querySelector('#item-purchase-history');

    let item = template.content.cloneNode(true);
    root.appendChild(item);
}


init();