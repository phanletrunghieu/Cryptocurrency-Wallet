const request = require('request');
const bitcore = require('bitcore-lib');
const explorers = require('bitcore-explorers');
const bitcoinaddress = require('bitcoin-address');

function BTCService() {
  this.getBalance = (address) => {
    return new Promise((resolve, reject) => {

      if (!bitcoinaddress.validate(address)) {
        return reject('Address checksum failed');
      }
      //get balance using the blockchain api
      const url = 'https://blockchain.info/address/' + address + '?format=json';

      request(url, function(error, response, body) {

        if (error) {
          return reject(error);
        }
        if (response.statusCode !== 200) {
          return reject(response.statusCode);
        }
        let balance = JSON.parse(body);
        resolve(balance);

      });
    });
  }

  this.createTransaction = (fromAddress, toAddress, amount, privateKey, minerFee, isTestnet=false) => {
    return new Promise((resolve, reject) => {
      if(isTestnet) {
        bitcore.Networks.defaultNetwork=bitcore.Networks.testnet;
      } else {
        bitcore.Networks.defaultNetwork=bitcore.Networks.livenet;
      }

      const unit = bitcore.Unit;
      const insight = new explorers.Insight(bitcore.Networks.defaultNetwork);
      minerFee = minerFee || 0.128;
      minerFee = unit.fromMilis(minerFee).toSatoshis(); //cost of transaction in satoshis (minerfee)
      const transactionAmount = unit.fromMilis(amount).toSatoshis(); //convert mBTC to Satoshis using bitcore unit

      if (!bitcoinaddress.validate(fromAddress, isTestnet ? "testnet" : "prod")) {
        return reject('Origin address checksum failed');
      }
      if (!bitcoinaddress.validate(toAddress, isTestnet ? "testnet" : "prod")) {
        return reject('Recipient address checksum failed');
      }

      insight.getUnspentUtxos(fromAddress, function(error, utxos) {
        if (error) {
          //any other error
          console.log(error);
          return reject(error);
        } else {
          if (utxos.length == 0) {
            //if no transactions have happened, there is no balance on the address.
            return reject("You don't have enough Satoshis to cover the miner fee.");
          }
          //get balance
          let balance = unit.fromSatoshis(0).toSatoshis();
          for (var i = 0; i < utxos.length; i++) {
            balance += unit.fromSatoshis(parseInt(utxos[i]['satoshis'])).toSatoshis();
          }

          console.log('transactionAmount: ' + transactionAmount);
          console.log('minerFee: ' + minerFee);
          console.log('balance: ' + balance);

          //check whether the balance of the address covers the miner fee
          if ((balance - transactionAmount - minerFee) > 0) {

            //create a new transaction
            try {
              let bitcore_transaction = new bitcore.Transaction()
                .from(utxos)
                .to(toAddress, transactionAmount)
                .fee(minerFee)
                .change(fromAddress)
                .sign(privateKey);

              //handle serialization errors
              if (bitcore_transaction.getSerializationError()) {
                let error = bitcore_transaction.getSerializationError().message;
                switch (error) {
                  case 'Some inputs have not been fully signed':
                    return reject('Please check your private key');
                    break;
                  default:
                    return reject(error);
                }
              }

              // broadcast the transaction to the blockchain
              insight.broadcast(bitcore_transaction.serialize(), function(error, body) {
                if (error) {
                  reject('Error in broadcast: ' + error);
                } else {
                  resolve({
                    transactionId: body
                  });
                }
              });

            } catch (error) {
              console.log(error);
              return reject(error.message);
            }
          } else {
            return reject("You don't have enough Satoshis to cover the miner fee.");
          }
        }
      });
    });
  }

  return this;
}

module.exports = new BTCService();
