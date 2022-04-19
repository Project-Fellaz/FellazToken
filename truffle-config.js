require('dotenv').config();
require('babel-register')({
  ignore: /node_modules\/(?!openzeppelin-solidity)/
});
require('babel-polyfill');

const HDWalletProvider = require('truffle-hdwallet-provider');
const providerWithMnemonic = (mnemonic, providerUrl) => new HDWalletProvider(mnemonic, providerUrl, 15);

const infuraProvider = network => providerWithMnemonic(
  process.env.MNEMONIC || '',
  `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
);


const ropstenProvider = process.env.SOLIDITY_COVERAGE
  ? undefined
  : infuraProvider('rinkeby');


console.log();
module.exports = {
  networks: {
    mainnet: {
      host: infuraProvider('mainnet'),
      network_id: 1, // Match any network id
      gas: 6500000,
      gasPrice: 20000000000, //https://eth-converter.com/
      confirmations: 2
    },
    ropsten: {
      provider: ropstenProvider,
      network_id: 3 
    },
    rinkeby: {
      provider: infuraProvider('rinkeby'),
      network_id: 4 
    }
  },
  compilers: {
    solc: {
      version: "0.4.24",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: false,
         runs: 200
       }
      //  evmVersion: "byzantium"
      }
    }
  },  
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'KRW',
      gasPrice: 5
    }
  }
};
