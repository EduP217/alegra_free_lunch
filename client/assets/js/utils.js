const basepath = 'https://edup217.github.io/alegra_free_lunch/client';
const apipath = 'http://lb-alegra-test-314990600.us-east-1.elb.amazonaws.com/api/v1';
const currentDate = new Date();
const currentDateToTZ = `${currentDate.getFullYear()}-${leadZeros(currentDate.getMonth()+1)}-${currentDate.getDate()}T${leadZeros(currentDate.getHours())}:${leadZeros(currentDate.getMinutes())}:${leadZeros(currentDate.getSeconds())}Z`;
console.log(currentDateToTZ);
const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

function getData(url) {
    return fetch(`${apipath}/${url}`).then((res) => res.json()).then((data) => data);
}

function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return Math.round(diff / 60000);
}

function formatDateToLocal(date) {
    return `${date.getFullYear()}-${leadZeros(date.getMonth()+1)}-${date.getDate()} ${leadZeros(date.getHours())}:${leadZeros(date.getMinutes())}:${leadZeros(date.getSeconds())}`;
}

function leadZeros(num) {
    return num.toString().padStart(2,'0');
}

function GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}

function postData(url, data) {
    return fetch(`${apipath}/${url}`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
    })
    .then((res) => res.json())
    .then((data) => [1,data])
    .catch((res) => [0,res]);
}