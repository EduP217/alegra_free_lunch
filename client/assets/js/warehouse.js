const myModal = new bootstrap.Modal(document.getElementById('purchaseModal'), {
    keyboard: false
});

async function init() {
    let warehouse = await getData("warehouse");
    renderWarehouse(warehouse.ingredients);
    renderPurchaseHistory(warehouse.purchase.reverse());

    document.getElementById("request-empty-ingredients").addEventListener("click",purcharseIngredients);
    document.getElementById("btn-modal-purchase").addEventListener("click",async () => {
        let pId = document.getElementById("inp-purchased-id").value;
        let pStatus = document.getElementById("pstatus").value;
        const res = await putData("warehouse", {id:pId, updateStatus: pStatus, dateReceived: currentDateToTZ});
        console.log(res);
        displayAlert(res[0],res[1].message);
        setTimeout(function (){
            location.reload();
        }, 1000);
    });    
}

function renderWarehouse(list) {
    const tbody = document.querySelector('#table-warehouse tbody');
    const template = document.querySelector('#item-table-ingredients');
    for (const i of list) {
        let item = template.content.cloneNode(true);
        let itemId = item.querySelector("th");
        let itemCol = item.querySelectorAll("td");

        let itemStatus = "Available";
        if(i.status == "0"){
            itemStatus = "Empty";
        }

        itemId.innerHTML = i.id;
        itemCol[0].innerHTML = i.name;
        itemCol[1].innerHTML = i.stock;
        itemCol[2].innerHTML = itemStatus;

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

        let itemClick = item.querySelector("a");
        itemClick.addEventListener("click",(e)=>{
            document.querySelector("#inp-purchased-id").value = i.id;
            document.querySelector("#modal-purchased-id").innerHTML = i.id;
            myModal.toggle();
        });

        root.appendChild(item);
    }
}

async function purcharseIngredients(){
    const res = await postData("warehouse", {datePurchased: currentDateToTZ});
    console.log(res);

    displayAlert(res[0],res[1].message);

    setTimeout(function (){
        location.reload();
    }, 1000);
}

init();