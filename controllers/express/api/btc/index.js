var config = require('../../../../config');
var express = require('express');
let bitcoin = require('bitcoinjs-lib');
var lib_response = require(config.library_dir + '/response_express');

var btcRouter = express.Router();

btcRouter.post("/generateBTCAddress", (req, res)=>{
  var keyPair = bitcoin.ECPair.makeRandom();
  var wif = keyPair.toWIF();
  var address = keyPair.getAddress();
  lib_response.success(res, {
    private: wif,
    address: address
  });
});

module.exports = btcRouter;
