const axios = require('axios');
const fs = require('fs');
const path = require('path');
require("dotenv").config();
//rerequest counter
let u = 0;
// Function to download a file using a direct link
async function downloadFile(url, outputPath) {
    const writer = fs.createWriteStream(outputPath);

    // Make an HTTP GET request to the direct link
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    });

    // Pipe the response data to the file
    response.data.pipe(writer);

    // Return a promise to indicate when the download is complete
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

const letDownload = (directLink, fileName, u) => {

const outputFilePath = path.join(__dirname, "/downloads/",fileName);
console.log('Downloading file to: ', outputFilePath);


downloadFile(directLink, outputFilePath)
    .then(() => {
        console.log(`DONE : ${fileName} downloaded successfully`);
    })
    .catch(error => {
        console.error(`Error downloading file: ${fileName}`);
        //delete file if error occurs
        fs.appendFile('errorDownload.txt', `ERROR : ,URL ${u} rereq proceed`, (err) => {
            
            if (err) throw err;
        });
        console.log(`...re request initiated : ${process.env.API1} x ${u}`);
        fs.unlink(outputFilePath, (err) => {
            if (err) throw err;
        });
        //re request
        const reqData2 = require("./fetchDatav2");
        reqData2(u, process.env.API1);

    });
}

module.exports = letDownload;
