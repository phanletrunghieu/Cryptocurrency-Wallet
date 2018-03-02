var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var config = require('./config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/api', require("./controllers/express/api"));

app.listen(config.port, config.host, ()=>{console.log("Server started!")});
