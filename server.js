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

app.use(bp.json());
app.get("/", async (req, res) => {
  let teraboxLink = req.query.url;
  console.log("teraboxLink : ", teraboxLink);
  reqData(teraboxLink, process.env.API1);
  //wait untill response fetched
  console.log("File Submitted to download");
  res.send("File Submitted to download");
});

//check server is alive
app.get("/ping", async (req, res) => {
  res.send("pong");
});

app.get("/download", async (req, res) => {
    //creates download pipeline
    download(res);1
});

app.get("/del", async (req, res) => {
//delete zip files in project directory
  fs.readdir(__dirname, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      if (file.endsWith(".zip")) {
        fs.unlink(path.join(__dirname, file), (err) => {
          if (err) throw err;
        });
      }
    }
  });
  res.send("All zip files deleted");
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
  console.log("teraboxLink : ", teraboxLinks);
  let apis = [process.env.API1, process.env.API2];
  let apiIndex = 0; // Initialized the API index to 0

  //submit multiple requests to seperate apis seperately
  teraboxLinks.forEach((link) => {
    const currentAPI = apis[apiIndex];
    console.log(`Requesting to API : link ${link}- ${currentAPI}`);
    reqData(link, currentAPI);
    apiIndex++;
    if (apiIndex >= apis.length) {
      apiIndex = 0;
    }
  });
  res.send("All Files Submitted to download  :}");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
