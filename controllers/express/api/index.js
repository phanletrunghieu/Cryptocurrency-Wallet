var config = require('../../../config');
var express = require('express');
var lib_mycrypto = require(config.library_dir + '/mycrypto');

var apiRouter = express.Router();

apiRouter.use((req, res, next)=>{
  //decrypt privateKey
	req.body=JSON.parse(JSON.stringify(req.body));
	if(req.body.hasOwnProperty('privateKey') && req.body.hasOwnProperty('encryptionKey')){
		req.body.privateKey=lib_mycrypto.decrypt(req.body.privateKey, req.body.encryptionKey);
	}

	req.query=JSON.parse(JSON.stringify(req.query));
	if(req.query.hasOwnProperty('privateKey') && req.query.hasOwnProperty('encryptionKey')){
		req.query.privateKey=lib_mycrypto.decrypt(req.query.privateKey, req.query.encryptionKey);
	}
  next();
})

apiRouter.use('/btc', require("./btc"));
apiRouter.use('/btc-testnet', require("./btc_testnet"));

apiRouter.use('/eth', require("./eth"));
apiRouter.use('/eth-testnet', require("./eth_testnet"));

module.exports = apiRouter;
