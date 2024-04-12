/*
*   @desc: Middleware to get data
*   @param: request, response, next
*   @return: JSON object
*/

const axios = require('axios');
const downloadFile = require('./downloadHere');

function reqData(url) {
    console.log(`GET : https://terabox-app-pearl.vercel.app/api?data=${"\""+url+"\""}`);
    
    //axios get request to the url
    axios.get(`https://terabox-app-pearl.vercel.app/api?data=${url}`) 
        .then(response => {
            console.log('RESPONSE : (file_name)', response.data.file_name);
            let link = response.data.direct_link;
            let name = response.data.file_name;
            //download linked file
            console.log('Downloading file...');
            downloadFile(link, name);

        })
        .catch(error => {
            console.log('ERROR : (axios get)', error);
            console.log(error);
        });
}


module.exports = reqData;
