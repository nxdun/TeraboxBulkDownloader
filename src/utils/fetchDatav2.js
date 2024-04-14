/*
*   @desc: Middleware to get data
*   @param: request, response, next
*   @return: JSON object
*/
const fs = require('fs');
const axios = require('axios');
require("dotenv").config();
const downloadFile = require('./downloadHere');

async function reqData2(url, api_url) {
    //generate a random letter
    const randomLetter = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    try {
        console.log(`GET: https://${api_url}/api?data="${url}"`);

        const response = await axios.get(`https://${api_url}/api?data=${url}`);
        console.log(`RESPONSE2: (file_name) ${response.data.file_name}`);

        //fetch link, not direct_link
        const link = response.data.link;
        const name = `${randomLetter}${response.data.file_name}`;

        console.log('Downloading file...');
        await downloadFile(link, name, url);
    } catch (error) {
        console.log(`ERROR:reqData2 (axios get) URL: ${url}, API: ${api_url}`);

        try {
            console.log("re-request initialized");
            const response = await axios.get(`https://${process.env.API1}/api?data=${url}`);
            console.log(`RESPONSE2: (file_name) ${response.data.file_name}`);

            const link = response.data.direct_link;
            const name = `${randomLetter}${response.data.file_name}`;

            console.log('RE:Downloading file...');
            await downloadFile(link, name, url);
        } catch (reError) {
            console.log(`ERROR:reqData2 RE:(axios get) URL: ${url || "none"}, API: ${api_url}`);
            fs.appendFile('errorFetch.txt', `ERROR: RE:(axios get) URL: ${url || "none"}, API: ${api_url}\n`, (err) => {
                if (err) throw err;
            });
        }

        fs.appendFile('errorFetch.txt', `ERROR:reqData2 (axios get) URL: ${url}, API: ${api_url}\n`, (err) => {
            if (err) throw err;
        });
    }
}

module.exports = reqData2;
