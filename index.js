const express = require('express');
const Web3 = require('web3');
const TokenABI = require('@chainlink/abi/v0.4/LinkToken.json');
const Alice = require('./Alice.json');
const Bob = require('./Bob.json');

const contractAddr = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';

async function startServer() {
   console.log('🟡 Starting Express server...');

   const port = 3000;

   const App = express();

   App.get('/', (req, res) => {
      return res.send('🟢 Server online. Expecting POST requests on /v0');
   });

   App.use(express.json());
   App.use(require('./routes'));

   App.listen(port, () => {
      console.log('🟢 $LINK PoC API listening on port', port);
   });

   const provider = await new Web3.providers.HttpProvider(
      'https://rinkeby.infura.io/v3/43598f8c3fcf439b8afee03a0044ac0e'
   );

   const web3 = new Web3(provider);

   const currentBlock = await web3.eth.getBlock('latest');

   console.log('🟢 Connected to Rinkeby via', await web3.currentProvider.host);

   console.log('🟢 Current block: ', currentBlock.number);

   web3.eth.defaultAccount = Alice.address;

   console.log("🟢 Connected to Alice's account:", Alice.address);

   console.log('🟡 Instatiating contracts...');

   const tokenContract = await new web3.eth.Contract(
      TokenABI.abi,
      contractAddr
   );

   console.log(
      `🟢 Connected to token contract '${TokenABI.contractName}' at ${contractAddr}`
   );

   let amount = 0;

   console.log('Alice is trying to buy some $LINK...');

   buy(Alice, amount);

   console.log(`Alice bought ${amount} $LINK`);

   console.log('Alice is trying to transfer some $LINK to Bob...');

   transfer(Alice, Bob.address, amount);

   console.log(
      `Bob's $LINK balance: ${await tokenContract.methods
         .balanceOf(Bob.address)
         .call({ from: Bob.address })}`
   );
}

async function buy(encryptedObj, amount) {}

async function transfer(encryptedObj, to, amount) {}

startServer();
