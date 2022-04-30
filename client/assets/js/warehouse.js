async function init() {
    let warehouse = await getData("warehouse");
    renderWarehouse(warehouse.ingredients);
    renderPurchaseHistory(warehouse.purchase.reverse());

    document.getElementById("request-empty-ingredients").addEventListener("click",purcharseIngredients);
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
        let itemIcon = item.querySelector(".item-icon");
        let itemPurchased = item.querySelector(".item-purchased");
        let itemReceived = item.querySelector(".item-received");
        let itemDescription = item.querySelector(".item-description");
        let itemStatus = item.querySelector(".item-status");

        let purchaseStatus = "Purchased";
        if(i.status == 1){
            purchaseStatus = "Canceled";
            itemIcon.classList.remove("text-primary");
            itemIcon.classList.add("text-danger");
            itemStatus.classList.remove("text-primary");
            itemStatus.classList.add("text-danger");
        } else if(i.status == 2){
            purchaseStatus = "Completed";
            itemIcon.classList.remove("text-primary");
            itemIcon.classList.add("text-success");
            itemStatus.classList.remove("text-primary");
            itemStatus.classList.add("text-success");
        } else if(i.status == 3){
            purchaseStatus = "Rejected";
            itemIcon.classList.remove("text-primary");
            itemIcon.classList.add("text-danger");
            itemStatus.classList.remove("text-primary");
            itemStatus.classList.add("text-danger");
        }

        itemPurchased.innerHTML = `P: ${i.purchased}`;
        itemReceived.innerHTML = `R: ${i.received}`;
        itemStatus.innerHTML = purchaseStatus;

        let iDescription = [];
        i.ingredients.forEach(el => {
            iDescription.push(el.name);
        });

        itemDescription.innerHTML = iDescription.join(", ");

        root.appendChild(item);
    }
}

async function purcharseIngredients(){
    const res = await postData("warehouse", {datePurchased: currentDateToTZ});
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