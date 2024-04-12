//simple express server
const express = require("express");
const app = express();
const port = 3000;
const bp = require("body-parser");
const reqData = require("./fetchData");
const path = require("path");
require("dotenv").config();
const download = require("./archiveAndSend");
const fs = require("fs");
const clearZips = require("./clearZips");

app.use(bp.json());
app.get("/", async (req, res) => {
  let teraboxLink = req.query.url;
  //if url is not provided
  if (!teraboxLink) {
    res.send("Please provide a url");
    return;
  }
  console.log("teraboxLink : ", teraboxLink);
  reqData(teraboxLink, process.env.API1, res);
  //wait untill response fetched
  console.log("File Submitted to download");
  res.send("File Submitted to download");
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
    //delete contents in download folder
    fs.readdir(path.join(__dirname, "downloads"), (err, files) => {
        if (err) throw err;
    
        for (const file of files) {
            fs.unlink(path.join(__dirname, "downloads", file), (err) => {
                if (err) throw err;
            });
        }
    });
    res.send("All files in download folder deleted");
    });

app.get("/multi", async (req, res) => {
  let teraboxLinks = req.query.url.split(",");

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
    reqData(link, currentAPI, res);
    apiIndex++;
    if (apiIndex >= apis.length) {
      apiIndex = 0;
    }
  });
  res.send("All Files Submitted to download  :}");
});

app.get("*", async (req, res) => {
  res.send("wtf are you doing");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
