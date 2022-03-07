const express = require('express');
const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const TokenABI = require('@chainlink/abi/v0.4/LinkToken.json');
const Alice = require('./Alice.json');
const Bob = require('./Bob.json');

const contractAddr = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';

console.log('🟡 Starting Express server...');

const port = 3000;

const App = express();

App.get('/', (req, res) => {
   return res.send('🟢 Server online. Expecting POST requests on /v0');
});

App.use(express.json());
App.use(require('./routes'));

App.listen(port, () => {
   // console.log('🟢 $LINK PoC API listening on port', port);
});

const provider = new Web3.providers.HttpProvider(
   'https://rinkeby.infura.io/v3/43598f8c3fcf439b8afee03a0044ac0e'
);

const web3 = new Web3(provider);

console.log('🟢 Connected to Rinkeby network via', web3.currentProvider.host);

web3.eth.defaultAccount = Alice.address;

console.log("🟢 Connected to Alice's account:", Alice.address);

console.log('🟡 Instatiating contracts...');

const tokenContract = new Contract(TokenABI.abi, contractAddr);

console.log(
   `🟢 Connected to token contract '${TokenABI.contractName}' at ${contractAddr}`
);
