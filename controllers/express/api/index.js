var express = require('express');

var apiRouter = express.Router();

apiRouter.use('/btc', require("./btc"));
apiRouter.use('/btc-testnet', require("./btc_testnet"));

apiRouter.use('/eth', require("./eth"));
apiRouter.use('/eth-testnet', require("./eth_testnet"));

module.exports = apiRouter;
