const basepath = 'https://edup217.github.io/alegra_free_lunch/client';
const currentDate = new Date();
console.log(currentDate);

function getData(url) {
    return fetch(`${basepath}/${url}`).then((res) => res.json()).then((data) => data);
}