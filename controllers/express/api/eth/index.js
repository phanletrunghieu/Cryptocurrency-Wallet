var config = require('../../../../config');
var express = require('express');
var Wallet=require('ethereumjs-wallet');

var lib_response = require(config.library_dir + '/response_express');
var lib_common = require(config.library_dir + '/common');

var web3 = lib_common.getWeb3Instance();

var ethRouter = express.Router();

ethRouter.post("/generateETHAddress", (req, res)=>{
  var wallet=Wallet.generate();
	var privateKey=wallet.getPrivateKeyString().slice(2);
	var publicKey=wallet.getPublicKeyString().slice(2);
	var address=wallet.getAddressString();

	lib_response.success(res, {
		privateKey: privateKey,
		publicKey: publicKey,
		address: address,
	});
});

ethRouter.post("/transfer", (req, res)=>{
  var isMissProp=lib_common.checkMissParams(res, req.body, ['privateKey', 'from', 'to', 'value']);
  if(isMissProp)
    return;

  try{
    var transaction = lib_common.sendRawTransactionMainnet(req.body.from, req.body.to, req.body.privateKey, null, web3.toWei(req.body.value, "ether"), req.body.gasPrice, req.body.gasLimit);
    response.success(res, transaction);
	}catch(err){
		response.exception(res, err.message);
	}
});

module.exports = ethRouter;