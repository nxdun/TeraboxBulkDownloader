const axios = require('axios');
const fs = require('fs');
const path = require('path');


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

const letDownload = (directLink, fileName) => {

const outputFilePath = path.join(__dirname, fileName);
console.log('Downloading file to: ', outputFilePath);
downloadFile(directLink, outputFilePath)
    .then(() => {
        console.log('DONE : File downloaded successfully');
    })
    .catch(error => {
        console.error('Error downloading file:', error);
    });
}

module.exports = letDownload;
