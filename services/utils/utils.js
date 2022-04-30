const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const readFromCSV = (url) => {
    return new Promise(async (resolve, reject) => {
        let records = [];
        await fs.createReadStream(appRoot + url)
            .pipe(csv())
            .on('data', (row) => {
                //console.debug(row);
                records.push(row);
            })
            .on('end', () => {
                console.log(url + ' file successfully processed');
                resolve(records);
            });
    });
};

const getFilteredByKey = (array, key, value) => {
    return array.filter(function (e) {
        return e[key] == value;
    });
};

const writeCSV = (url, options, data) => {
    const csvWriter = createCsvWriter({
        path: appRoot + url,
        header: options
    });

    csvWriter
        .writeRecords(data)
        .then(() => console.log('The CSV file was written successfully'));
};

const zeroPad = (num, places) => String(num).padStart(places, '0');

const getMarketPlaceBuy = (array) => {
    return new Promise(async (resolve, reject) => {
        let marketplace = [];
        await array.forEach(async i => {
            let result = await fetch(`${marketplaceURL}?ingredient=${i.name}`).then(res => res.json());
            if(result && result.quantitySold > 0){
                marketplace.push({"id":i.id,"quantity":result.quantitySold});
            }
        });
        resolve(marketplace);
    });
};

module.exports = {
    readFromCSV,
    getFilteredByKey,
    writeCSV,
    zeroPad
}