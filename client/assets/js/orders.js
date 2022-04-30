async function init() {
    let orders = await getData("orders");

    renderOrdersOnHold(orders.pending.reverse());
    renderOrdersToPickUp(orders["pick-up"].reverse());
    renderOrdersHistory(orders.history.reverse());

    document.getElementById("request-new-order").addEventListener("click",purchaseOrder);
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
        let diffTimeInMinutes = getMinutesBetweenDates(itemOrdered,currentDate);
        itemTime.innerHTML = `${diffTimeInMinutes} min.`;
        root.appendChild(item);
    }
}

function renderOrdersToPickUp(list) {
    const root = document.getElementById('orders-list-item-container');
    const template = document.querySelector('#orderitempickup');
    for (const i of list) {
        let item = template.content.cloneNode(true);
        let itemImage = item.querySelector(".item-image");
        let itemName = item.querySelector(".item-name");
        let itemTime = item.querySelector(".item-time");

        itemName.innerHTML = i.food;
        itemImage.setAttribute("src",`${basepath}/assets/${i.image}`);
        itemImage.setAttribute("alt",i.food);

        let itemOrdered = new Date(i.ordered);
        console.log(itemOrdered);
        let diffTimeInMinutes = getMinutesBetweenDates(itemOrdered,currentDate);
        itemTime.innerHTML = `${diffTimeInMinutes} min.`;
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

        let dateOrdered = new Date(i.ordered);
        let dateDelivered = new Date(i.delivered);

        let orderStatus = "Failed";
        if(i.status == 2){
            orderStatus = "Completed";
        }

        itemId.innerHTML = i.id;
        itemCols[0].innerHTML = i.food;
        itemCols[1].innerHTML = formatDateToLocal(dateOrdered);
        itemCols[2].innerHTML = formatDateToLocal(dateDelivered);
        itemCols[3].innerHTML = orderStatus;

        tbody.appendChild(item);
    }
}

async function purchaseOrder(){
    const res = await postData("orders", {dateOrdered: currentDateToTZ});
    console.log(res);

    const root = document.getElementById('item-alert-container');
    const template = document.querySelector('#alertTemplate');
    let item = template.content.cloneNode(true);

    let alert = item.querySelector(".item-alert-message");
    if(res[0] == 1){
        alert.classList.add("alert-success");
    } else {
        alert.classList.add("alert-danger");
    }
    alert.insertAdjacentHTML("afterbegin", res[1].message);
    alert.classList.add("show");

    root.append(alert);

    setTimeout(function (){
        location.reload();
    }, 1000);
}

init();