/*
*   @desc: Middleware to get data
*   @param: request, response, next
*   @return: JSON object
*/

const axios = require('axios');

function reqData(req, res, url) {
    console.log(`https://terabox-app-pearl.vercel.app/api?data=${"\""+url+"\""}`);
    
    //axios get request to the url
    axios.get(`https://terabox-app-pearl.vercel.app/api?data=${url}`)
        .then(response => {
            console.log(response.data);
            res.send(response.data);1
        })
        .catch(error => {
            console.log(error);
        });
}

module.exports = reqData;
