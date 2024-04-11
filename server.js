//simple express server
const express = require('express');
const app = express();
const port = 3000;
const bp = require('body-parser');
const reqData = require('./fetchData');

app.use(bp.json());
app.get('/', (req, res) => {
    let url = req.body.url;
    reqData(req, res, url);

    
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
