const https = require("https");
const fs = require("fs");
const downloadFile = require("./downloadHere");

class DataRequest {
    constructor(apiUrl, backupApiUrl) {
        this.apiUrl = apiUrl;
        this.backupApiUrl = backupApiUrl;
        this.randomLetter = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5);
    }

    async makeRequest(url) {
        const options = {
            hostname: this.apiUrl,
            path: `/api?data=${url}`,
            method: 'GET',
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                let data = '';

                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    const response = JSON.parse(data);
                    resolve(response);
                });
            });

            req.on('error', error => {
                reject(error);
            });

            req.end();
        });
    }

    async fetchData(url, res) {
        try {
            console.log(`GET: https://${this.apiUrl}/api?data=${url}`);
            const response = await this.makeRequest(url);

            console.log(`RESPONSE: (file_name) ${response.file_name}`);
            const link = response.direct_link;
            const name = `${this.randomLetter}_${response.file_name}`;

            res.write(`<img src=${response.thumb}>`);
            console.log("GET successful. Downloading file...");

            // Send initial response indicating download is starting
            res.write('Download started. Please wait...');

            // Start downloading the file and stream it to the client
            await downloadFile(link, name, url, (progress) => {
                // Send real-time update to the client
                res.write(`\nDownload Progress: ${progress}%`);
            });

            // Download completed, send completion message
            res.write('</body></html>');
            res.end('\nDownload complete!');
        } catch (error) {
            console.error(`Error occurred during request: ${error}`);

            try {
                console.log(`Retrying request with backup API: ${this.backupApiUrl}`);
                const response = await this.makeRequest(url);

                console.log(`RESPONSE: (file_name) ${response.file_name}`);
                const link = response.direct_link;
                const name = `${this.randomLetter}_${response.file_name}`;

                console.log("Retried request successful. Downloading file...");

                res.write('Download started. Please wait...');

                await downloadFile(link, name, url, (progress) => {
                    res.write(`\nDownload Progress: ${progress}%`);
                });

                res.end('\nDownload complete!');
            } catch (reError) {
                console.error(`Failed to retrieve data from both APIs for URL: ${url}, Error: ${reError}`);

                // Inform client about the failure
                res.end(`Failed to download file from both APIs. Error: ${reError}`);
            }

            // Log the error to a file
            fs.appendFile('errorFetch.txt', `Error occurred during request: ${error}\n`, (err) => {
                if (err) console.error(`Error writing to file: ${err}`);
            });
        }
    }
}

module.exports = DataRequest;
