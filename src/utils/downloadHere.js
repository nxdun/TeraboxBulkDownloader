const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const readline = require("readline");

// Function to download a file using a direct link
async function downloadFile(url, outputPath) {
    const writer = fs.createWriteStream(outputPath);

    try {
        // Make an HTTP GET request to the direct link
        const response = await axios({
            method: "GET",
            url: url,
            responseType: "stream",
        });

        // Get the total size of the file
        const contentLength = parseInt(response.headers["content-length"], 10);
        let downloadedSize = 0;

        // Create readline interface
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        let updateInterval;
        response.data.on("data", (chunk) => {
            // Update the downloaded size
            downloadedSize += chunk.length;
            // Calculate the download percentage
            const percentage = (downloadedSize / contentLength) * 100;

            //int no decimal 3 random numbers
            const random = Math.floor(Math.random() * 100);

            // Clear the current line and write the download percentage
            clearTimeout(updateInterval); // Clear previous update timeout
            updateInterval = setTimeout(() => {
                rl.write(null, { ctrl: true, name: "u" });
                rl.write(`${percentage.toFixed(2)} === ${outputPath}]`);
            }, random); // Set the delay here (in milliseconds)
        });
        // Pipe the response data to the file
        response.data.pipe(writer);

        // Return a promise to indicate when the download is complete
        return new Promise((resolve, reject) => {
            writer.on("finish", () => {
                // After finishing writing, add a newline character to end the line
                rl.write("\n");
                rl.close();
                resolve();
            });
            writer.on("error", reject);
        });
    } catch (error) {
        throw new Error(`Error downloading file: ${error}`);
    }
}

const letDownload = (directLink, fileName, u) => {
    const outputFilePath = path.join(__dirname, "..", "..", "downloads", fileName);
    console.log(`!!!!!!!!!!!!output file path ${outputFilePath}`)
    console.log("Downloading file to: ", outputFilePath);

    downloadFile(directLink, outputFilePath)
        .then(() => {
            console.log(`DONE : ${fileName} downloaded successfully`);
        })
        .catch((error) => {
            console.error(`Error downloading file: ${fileName}`);

            // Log error and initiate re-request
            console.log(`...re-request initiated: ${process.env.API1} x ${u}`);
            fs.appendFile(
                "errorDownload.txt",
                `${u},  error ${error}`,
                (err) => {
                    if (err) console.error(`Error writing to file: ${err}`);
                }
            );
            fs.unlink(outputFilePath, (err) => {
                if (err) console.error(`Error deleting file: ${err}`);
            });
            console.log(`RE REQUEST: ${u}`);
            // Looping unlimitedly
            // const reqData = require("./fetchData");
            // reqData(u, process.env.API2);
        });
};


module.exports = letDownload;
