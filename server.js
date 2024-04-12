//simple express server
const express = require('express');
const app = express();
const port = 3000;
const bp = require('body-parser');
const reqData = require('./fetchData');

app.use(bp.json());
app.get('/',async  (req, res) => {
    let url = req.query.url;
    console.log('URL : ', url);
    reqData(url);
    //wait untill response fetched
    console.log('File Submitted to download');
    res.send('File Submitted to download');

});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
