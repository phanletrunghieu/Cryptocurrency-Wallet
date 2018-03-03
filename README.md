
# Cryptocurrency Wallet
Support Bitcoin and Ethereum.

## Prerequisites
You need to install NodeJS 8+ & npm

## Installation
`git pull https://github.com/phanletrunghieu/Cryptocurrency-Wallet.git`
`cd Cryptocurrency-Wallet`
`npm i`
`node index.js`

## Bug
If it appears "Error: More than one instance of bitcore-lib found" then:
 - `cd node_modules/bitcore-explorers/node_modules/bitcore-lib`
 - `vim index.js`
 - Find line `bitcore.versionGuard = function(version) {` and change it to `bitcore.versionGuard = function(version) { return;`
 - Save
 - `cd ../../../../`
 - `node index.js`
