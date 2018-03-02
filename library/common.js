var config = require('../config');
var response_express = require('./response_express');
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
var web3Testnet = new Web3(new Web3.providers.HttpProvider(config.web3Provider.testnet));
var web3Mainnet = new Web3(new Web3.providers.HttpProvider(config.web3Provider.mainnet));

exports.findMissParams = function(obj, checkProps) {
	if(!Array.isArray(checkProps)){
		checkProps = [checkProps];
	}

	obj=JSON.parse(JSON.stringify(obj));
	var missProps=[];
	for (var i = 0; i < checkProps.length; i++) {
		if(!obj.hasOwnProperty(checkProps[i])){
			missProps.push(checkProps[i]);
		} else if(!obj[checkProps[i]]){
			missProps.push(checkProps[i]);
		}
	}
	return missProps;
};

exports.checkMissParams = function(res, obj, checkProps) {
	var missProps=this.findMissParams(obj, checkProps);
	if(missProps.length>0){
		response_express.exception(res, "Miss some params: " + missProps.toString());
		return true;
	}
	return false;
};

exports.converterToPlainObject = function(obj){
	return JSON.parse(JSON.stringify(obj));
};

exports.getWeb3Instance = function(isTestnet=false) {
	if (isTestnet) {
		return new Web3(new Web3.providers.HttpProvider(config.web3Provider.testnet));
	} else {
		return new Web3(new Web3.providers.HttpProvider(config.web3Provider.mainnet));
	}
};

exports.sendRawTransactionMainnet = function(from, to, privateKey, data=null, value=null, gasPrice=null, gasLimit=null){
  var rawTx = {
    from: from,
    to: to,
  }

  if(data)
    rawTx.data=data;
  if(value)
    rawTx.value=value;


  gasPrice=gasPrice || web3Mainnet.toWei(config.defaultGasPrice, "gwei") || web3Mainnet.eth.gasPrice;

  if(!gasLimit){
    gasLimit = web3Mainnet.eth.estimateGas(rawTx);
  }

  rawTx.nonce=web3Mainnet.toHex(web3Mainnet.eth.getTransactionCount(from, "pending"));
  rawTx.gasPrice=web3Mainnet.toHex(gasPrice);
  rawTx.gasLimit=web3Mainnet.toHex(gasLimit);

  var privateKey = new Buffer(privateKey, 'hex');

  var tx = new Tx(rawTx);
  tx.sign(privateKey);

  var serializedTx = tx.serialize();
  var transactionHash=web3Mainnet.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
  return web3Mainnet.eth.getTransaction(transactionHash);
};

exports.sendRawTransactionTestnet = function(from, to, privateKey, data=null, value=null, gasPrice=null, gasLimit=null){
  var rawTx = {
    from: from,
    to: to,
  }

  if(data)
    rawTx.data=data;
  if(value)
    rawTx.value=value;


  gasPrice=gasPrice || web3Testnet.toWei(config.defaultGasPrice, "gwei") || web3Testnet.eth.gasPrice;

  if(!gasLimit){
    gasLimit = web3Testnet.eth.estimateGas(rawTx);
  }

  rawTx.nonce=web3Testnet.toHex(web3Testnet.eth.getTransactionCount(from, "pending"));
  rawTx.gasPrice=web3Testnet.toHex(gasPrice);
  rawTx.gasLimit=web3Testnet.toHex(gasLimit);

  var privateKey = new Buffer(privateKey, 'hex');

  var tx = new Tx(rawTx);
  tx.sign(privateKey);

  var serializedTx = tx.serialize();
  var transactionHash=web3Testnet.eth.sendRawTransaction('0x' + serializedTx.toString('hex'));
  return web3Testnet.eth.getTransaction(transactionHash);
};
