function getData() {
    renderOrdersOnHold();
    renderOrdersToPickUp();
    renderOrdersHistory();
}

function renderOrdersOnHold() {
    const root = document.getElementById('orders-cards-container');
    const template = document.querySelector('#orderpendingrow');

    let item = template.content.cloneNode(true);
    root.appendChild(item);
}

function renderOrdersToPickUp() {
    const root = document.getElementById('orders-list-item-container');
    const template = document.querySelector('#orderitempickup');

    let item = template.content.cloneNode(true);
    root.appendChild(item);
}

function renderOrdersHistory() {
    const tbody = document.querySelector('#table-orders-history tbody');
    const template = document.querySelector('#orderhistoryrow');

    let item = template.content.cloneNode(true);
    tbody.appendChild(item);
}

getData();