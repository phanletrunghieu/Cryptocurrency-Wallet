var config = require('../../../../config');
var express = require('express');
var Wallet=require('ethereumjs-wallet');
var randomize = require('randomatic');

var lib_response = require(config.library_dir + '/response_express');
var lib_common = require(config.library_dir + '/common');
var lib_mycrypto = require(config.library_dir + '/mycrypto');

var web3 = lib_common.getWeb3Instance();

var ethRouter = express.Router();

ethRouter.post("/generateETHAddress", (req, res)=>{
  var wallet=Wallet.generate();
	var privateKey=wallet.getPrivateKeyString().slice(2);
	var publicKey=wallet.getPublicKeyString().slice(2);
	var address=wallet.getAddressString();

  var encryptionKey=randomize("*", 32);

	lib_response.success(res, {
		privateKey: lib_mycrypto.encrypt(privateKey, encryptionKey),
		publicKey: publicKey,
		address: address,
    encryptionKey: encryptionKey,
	});
});

ethRouter.post("/transfer", (req, res)=>{
  var isMissProp=lib_common.checkMissParams(res, req.body, ['privateKey', 'encryptionKey', 'from', 'to', 'value']);
  if(isMissProp)
    return;

  try{
    var transaction = lib_common.sendRawTransactionMainnet(req.body.from, req.body.to, req.body.privateKey, null, web3.toWei(req.body.value, "ether"), req.body.gasPrice, req.body.gasLimit);
    response.success(res, transaction);
	}catch(err){
		response.exception(res, err.message);
	}
});

ethRouter.get("/getBalance", (req, res)=>{
  var isMissProp=lib_common.checkMissParams(res, req.query, ['address']);
  if(isMissProp)
    return;

  try{
    var balance = lib_common.getBalance(req.query.address);
    lib_response.success(res, balance);
	}catch(err){
		lib_response.exception(res, err.message || err);
	}
});

module.exports = ethRouter;
