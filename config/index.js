var path = require('path');

const root = path.normalize(__dirname + '/..');

module.exports = {
  host: '0.0.0.0',
	port: 3000,
  root_dir: root,
	models_dir: root + '/models',
	controllers_dir: root + '/controllers',
	library_dir: root + '/library',
  web3Provider: {
    testnet: 'https://ropsten.infura.io/6keRnm2rdnzMDcrl6E87',
    mainnet: 'https://mainnet.infura.io/6keRnm2rdnzMDcrl6E87',
  },
  defaultGasPrice: 20,
};
