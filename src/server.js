//simple express server
const express = require("express");
const app = express();
const port = 3000;
const bp = require("body-parser");
const reqData = require("./utils/fetchData");
const path = require("path");
require("dotenv").config();
const download = require("./utils/archiveAndSend");
const fs = require("fs");
const clearZips = require("./utils/clearZips");
const emitter = require("events").EventEmitter.defaultMaxListeners = 20;
const DataRequest = require('./utils/fetchDatav2');

app.use(bp.json());
app.get("/", async (req, res) => {
  res.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pls wait..</title>
  </head>
  <body>`);
  let teraboxLink = req.query.url;
  //if url is not provided
  if (!teraboxLink) {
    res.send("Please provide a url");
    return;
  }
  console.log("teraboxLink : ", teraboxLink);
  const dataRequest = new DataRequest(process.env.API1, process.env.API2);
  dataRequest.fetchData(teraboxLink, res);

  //reqData(teraboxLink, process.env.API1, res);
  //wait untill response fetched
  console.log("File Submitted to download");
});

app.get("/u", async (req, res) => {
  console.log("link fetch request recived");
  const axios = require("axios");
  let teraboxLink = req.query.url;
  //if url is not provided
  if (!teraboxLink) {
    res.send("Please provide a url");
    return;
  }
  res.send("recived")
  teraboxLink = teraboxLink.split(",");
  
  try {
    const promises = teraboxLink.map((link) => {
      return axios.get(`https://${process.env.API1}/api?data=${link}`);
    });

    const responses = await Promise.all(promises);
    
    responses.forEach((response) => {
      let counter = 0;
      console.log("fetched\t>",response.data.file_name);
      //clear previous file content in url.txt
      fs.writeFile(`url.txt`, "", (err) => {
        if (err) throw err;
      });
      
      //write all responses to a text file
      fs.appendFile(`url.txt`, `${response.data.direct_link}\n`, (err) => {
        if (err) throw err;
      });
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});


//check server is alive
app.get("/ping", async (req, res) => {
    let eventLoopIsEmpty = true;

    // Check if the event loop is empty using setImmediate
    await new Promise(resolve => setImmediate(resolve));
    eventLoopIsEmpty = false;

    const serverStatus = {
        server: 'Express Server',
        status: eventLoopIsEmpty ? 'Idle' : 'Busy'
    };
    res.json(serverStatus);
});

app.get("/download", async (req, res) => {
    //creates download pipeline
    download(res);
});

app.get("/del", async (req, res) => {
  clearZips(res, 1);
});

app.get("/deldown", async (req, res) => {
  try {
      const downloadFolderPath = path.join(__dirname, '..', 'downloads');
      
      // Read contents of the downloads folder
      fs.readdir(downloadFolderPath, (err, files) => {
          if (err) {
              console.error(`Error reading directory: ${err}`);
              throw err;
          }
          
          // Iterate through each file and delete it asynchronously
          files.forEach((file) => {
              const filePath = path.join(downloadFolderPath, file);
              
              // Delete each file asynchronously
              fs.unlink(filePath, (err) => {
                  if (err) {
                      console.error(`Error deleting file ${filePath}: ${err}`);
                      throw err;
                  }
                  console.log(`Deleted file: ${filePath}`);
              });
          });
          
          // Send response after all files are deleted
          res.send("All files in download folder deleted");
      });
  } catch (error) {
      console.error(`Error deleting files: ${error}`);
      res.status(500).send("Error deleting files");
  }
});

app.get("/multi", async (req, res) => {
  let teraboxLinks = req.query.url.split(",");
  let counter = 0;
  res.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pls wait..</title>
  </head>
  <body>`);
  const urlCount = teraboxLinks.length;

  let callback = () => {
    //get query url count
    counter++;

    if (counter === urlCount) {
      //set headers
      res.header("Content-Type", "text/html");
      res.write(`</body></html>`);
      res.send();
      res.end();
  }
};

  if (!teraboxLinks) {
    res.send("Please provide a url");
    return;
  }

  console.log("teraboxLink : ", teraboxLinks);
  let apis = [process.env.API1, process.env.API2];
  let apiIndex = 0; // Initialized the API index to 0

  //submit multiple requests to seperate apis seperately
  teraboxLinks.forEach((link) => {
    const currentAPI = apis[apiIndex];
    console.log(`Requesting to API : link ${link}- ${currentAPI}`);
    reqData(link, currentAPI, res, callback);
    apiIndex++;
    if (apiIndex >= apis.length) {
      apiIndex = 0;
    }
  });
});

app.get("*", async (req, res) => {
  res.send("wtf are you doing");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
