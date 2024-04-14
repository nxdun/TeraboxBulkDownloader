
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const downloadFile = require('./downloadHere');
const randomLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

async function reqData(url, api_url, res, cb) {
    try {

        console.log(`GET: https://${api_url}/api?data=${url}`);
        const response = await axios.get(`https://${api_url}/api?data=${url}`);

        console.log(`RESPONSE: (file_name) ${response.data.file_name}`);
        const link = response.data.direct_link;
        const name = `${randomLetter}_${response.data.file_name}`;
        
        res.write(`<img src=${response.data.thumb}>`);
        console.log('GET successful. Downloading file...');
        cb();
        await downloadFile(link, name, url);
    } catch (error) {
        console.error(`Error occurred during request: ${error}, type of cd ${typeof cb}`);

        try {
            console.log(`Retrying request with backup API: ${process.env.API1}`);
            const response = await axios.get(`https://${process.env.API1}/api?data=${url}`);
            
            console.log(`RESPONSE: (file_name) ${response.data.file_name}`);
            const link = response.data.direct_link;
            const name = `${randomLetter}_${response.data.file_name}`;

            console.log('Retried request successful. Downloading file...');
            await downloadFile(link, name, url);
        } catch (reError) {
            console.error(`Failed to retrieve data from both APIs for URL: ${url}, Error: ${reError}`);

            fs.appendFile('errorFetch.txt', `Failed to retrieve data from both APIs for URL: ${url}, Error: ${reError}\n`, (err) => {
                if (err) console.error(`Error writing to file: ${err}`);
            });
        }

        fs.appendFile('errorFetch.txt', `Error occurred during request: ${error}\n`, (err) => {
            if (err) console.error(`Error writing to file: ${err}`);
        });
    }
}

module.exports = reqData;
