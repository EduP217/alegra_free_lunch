const fetch = require('node-fetch');
const fs = require('fs');
const csv = require('csv-parser');
const stringify = require('csv-stringify');
//const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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
    /*const csvWriter = createCsvWriter({
        path: appRoot + url,
        header: options,
        quoted_string: true,
        quoted_empty: true
    });

    csvWriter
        .writeRecords(data)
        .then(() => console.log('The CSV file was written successfully'));*/
    stringify(data, {
        header: true,
        columns: options,
        quoted: true,
        quoted_empty: true
    }, async function (err, output) {
        await fs.writeFile(appRoot + url, output, function(err, result) {
            if(err) console.log('error', err);
            console.log('The CSV file was written successfully');
        });
    });

    /*const stringifier = stringify({
        header: true,
        columns: options,
        quoted_string: true,
        quoted_empty: true
    });

    stringifier.write(data);
    stringifier.end(() => console.log('The CSV file was written successfully'));*/
};

const zeroPad = (num, places) => String(num).padStart(places, '0');

const getMarketPlaceBuy = (array) => {
    return new Promise(async (resolve, reject) => {
        let marketplace = [];
        await Promise.all(array.map(async i => {
            let result = await fetch(`${marketplaceURL}?ingredient=${i.name}`).then(res => res.json());
            console.log(result);
            if(result && result.quantitySold > 0){
            //if(result){
                marketplace.push({"id":i.id,"quantity":result.quantitySold});
            }
        }));
        resolve(marketplace);
    });
};

module.exports = {
    readFromCSV,
    getFilteredByKey,
    writeCSV,
    zeroPad,
    getMarketPlaceBuy
}