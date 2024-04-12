/*
*   @desc: Middleware to get data
*   @param: request, response, next
*   @return: JSON object
*/
const fs = require('fs');
const axios = require('axios');
const downloadFile = require('./downloadHere');

function reqData(url, api_url) {

    console.log(`GET : https://${api_url}/api?data=${"\""+url+"\""}`);
    
    //axios get request to the url
    axios.get(`https://${api_url}/api?data=${url}`) 
        .then(response => {
            console.log('RESPONSE : (file_name)', response.data.file_name);
            let link = response.data.direct_link;
            let name = response.data.file_name;
            //download linked file
            console.log('Downloading file...');
            downloadFile(link, name);

        })
        .catch(error => {
            console.log(`ERROR : (axios get) URL : ${url}, API : ${api_url}`);
            //write error to error.txt file
            fs.appendFile('errorFetch.txt', `ERROR : (axios get) URL : ${url}, API : ${api_url}\n`, (err) => {
                if (err) throw err;
            });
        });
}


module.exports = reqData;
