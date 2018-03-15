var config = require('../../../../config');
var express = require('express');
let bitcoin = require('bitcoinjs-lib');
var randomize = require('randomatic');

var lib_response = require(config.library_dir + '/response_express');
var lib_common = require(config.library_dir + '/common');
var lib_btc = require(config.library_dir + '/BTCService');
var lib_mycrypto = require(config.library_dir + '/mycrypto');

var btcRouter = express.Router();

btcRouter.post("/generateBTCAddress", (req, res)=>{
  var keyPair = bitcoin.ECPair.makeRandom();
  var wif = keyPair.toWIF();
  var address = keyPair.getAddress();

  var encryptionKey=randomize("*", 32);

  lib_response.success(res, {
    private: lib_mycrypto.encrypt(wif, encryptionKey),
    address: address,
    encryptionKey: encryptionKey,
  });
});

btcRouter.post("/transfer", (req, res)=>{
  var isMissProp=lib_common.checkMissParams(res, req.body, ['privateKey', 'encryptionKey', 'from', 'to', 'value']);
  if(isMissProp)
    return;

  lib_btc.createTransaction(req.body.from, req.body.to, req.body.value, req.body.privateKey, req.body.fee)
  .then(result=>lib_response.success(res, result))
  .catch(err=>lib_response.exception(res, err.message || err));
});

btcRouter.get("/getBalance", (req, res)=>{
  var isMissProp=lib_common.checkMissParams(res, req.query, ['address']);
  if(isMissProp)
    return;

  lib_btc.getBalance(req.query.address)
  .then(balance=>{
    lib_response.success(res, balance);
  })
  .catch(err=>lib_response.exception(res, err.message || err));
});

module.exports = btcRouter;
