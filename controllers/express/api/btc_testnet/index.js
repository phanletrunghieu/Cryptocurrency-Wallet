var config = require('../../../../config');
var express = require('express');
let bitcoin = require('bitcoinjs-lib');
var lib_response = require(config.library_dir + '/response_express');

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
  var isMissProp=lib_common.checkMissParams(res, req.body, ['privateKey', 'to', 'value']);
  if(isMissProp)
    return;

  try{
    var key = bitcoin.ECKey.fromWIF(req.body.privateKey);
    var tx = new bitcoin.TransactionBuilder();
    tx.addInput("d18e7106e5492baf8f3929d2d573d27d89277f3825d3836aa86ea1d843b5158b", 1);
    tx.addOutput("12idKQBikRgRuZEbtxXQ4WFYB7Wa3hZzhT", 149000);
    var transaction = lib_common.sendRawTransactionMainnet(req.body.from, req.body.to, req.body.privateKey, null, web3.toWei(req.body.value, "ether"), req.body.gasPrice, req.body.gasLimit);
    response.success(res, transaction);
	}catch(err){
		response.exception(res, err.message);
	}
});

module.exports = btcTestNetRouter;
