const basepath = 'https://edup217.github.io/alegra_free_lunch/client';
const currentDate = new Date();
console.log(currentDate);
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
    return fetch(`${basepath}/${url}`).then((res) => res.json()).then((data) => data);
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