async function init() {
    let orders = await getData("data/orders.json");

    renderOrdersOnHold(orders.pending);
    renderOrdersToPickUp(orders["pick-up"]);
    renderOrdersHistory(orders.history);
}

function renderOrdersOnHold(list) {
    const root = document.getElementById('orders-cards-container');
    const template = document.querySelector('#orderpendingrow');
    for (const i of list) {
        let item = template.content.cloneNode(true);
        let itemName = item.querySelector(".item-name");
        let itemImage = item.querySelector(".item-image");
        let itemTime = item.querySelector(".item-time");

        itemName.innerHTML = i.food;
        itemImage.setAttribute("src",`${basepath}/assets/${i.image}`);
        itemImage.setAttribute("alt",i.food);

        let itemOrdered = new Date(i.ordered);
        console.log(itemOrdered);
        root.appendChild(item);
    }
}

function renderOrdersToPickUp(list) {
    const root = document.getElementById('orders-list-item-container');
    const template = document.querySelector('#orderitempickup');
    for (const i of list) {
        let item = template.content.cloneNode(true);
        let itemImage = item.querySelector(".item-image");
        let itemName = item.querySelector(".item-image");
        let itemTime = item.querySelector(".item-time");

        itemName.innerHTML = i.food;
        itemImage.setAttribute("src",`${basepath}/assets/${i.image}`);
        itemImage.setAttribute("alt",i.food);

        let itemOrdered = new Date(i.ordered);
        console.log(itemOrdered);
        root.appendChild(item);
    }
}

function renderOrdersHistory(list) {
    const tbody = document.querySelector('#table-orders-history tbody');
    const template = document.querySelector('#orderhistoryrow');
    for (const i of list) {
        let item = template.content.cloneNode(true);
        let itemId = item.querySelector("th");
        let itemCols = item.querySelectorAll("td");

        itemId.innerHTML = i.id;
        itemCols[0].innerHTML = i.food;
        itemCols[1].innerHTML = i.ordered;
        itemCols[2].innerHTML = i.delivered;
        itemCols[3].innerHTML = i.status;

        tbody.appendChild(item);
    }
}

init();