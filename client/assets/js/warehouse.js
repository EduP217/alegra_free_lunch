function getData() {
    renderWarehouse();
    renderPurchaseHistory();
}

function renderWarehouse() {
    const tbody = document.querySelector('#table-warehouse tbody');
    const template = document.querySelector('#item-table-ingredients');

    let item = template.content.cloneNode(true);
    tbody.appendChild(item);
}

function renderPurchaseHistory() {
    const root = document.getElementById('list-purchase-history');
    const template = document.querySelector('#item-purchase-history');

    let item = template.content.cloneNode(true);
    root.appendChild(item);
}


getData();