var config = require('../../../../config');
var express = require('express');
let bitcoin = require('bitcoinjs-lib');

var lib_response = require(config.library_dir + '/response_express');
var lib_common = require(config.library_dir + '/common');
var lib_btc = require(config.library_dir + '/BTCService');

var btcTestNetRouter = express.Router();

btcTestNetRouter.post("/generateBTCAddress", (req, res)=>{
  var testnet = bitcoin.networks.testnet;
  var keyPair = bitcoin.ECPair.makeRandom({ network: testnet });
  var wif = keyPair.toWIF();
  var address = keyPair.getAddress();
  lib_response.success(res, {
    private: wif,
    address: address
  });
});

btcTestNetRouter.post("/transfer", (req, res)=>{
  var isMissProp=lib_common.checkMissParams(res, req.body, ['privateKey', 'from', 'to', 'value']);
  if(isMissProp)
    return;

  lib_btc.createTransaction(req.body.from, req.body.to, req.body.value, req.body.privateKey, req.body.fee, true)
  .then(result=>lib_response.success(res, result))
  .catch(err=>lib_response.exception(res, err.message || err));
});

module.exports = btcTestNetRouter;
