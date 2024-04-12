//simple express server
const express = require("express");
const app = express();
const port = 3000;
const bp = require("body-parser");
const reqData = require("./fetchData");
require("dotenv").config();

app.use(bp.json());
app.get("/", async (req, res) => {
  let teraboxLink = req.query.url;
  console.log("teraboxLink : ", teraboxLink);
  reqData(teraboxLink, process.env.API1);
  //wait untill response fetched
  console.log("File Submitted to download");
  res.send("File Submitted to download");
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
