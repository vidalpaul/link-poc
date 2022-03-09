const express = require('express');
const Web3 = require('web3');
const TokenABI = require('@chainlink/abi/v0.4/LinkToken.json');
const Alice = require('./wallets/Alice.json');
const Bob = require('./wallets/Bob.json');
const Exchange = require('./wallets/Exchange.json');

const contractAddr = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';

async function startServer() {
   console.log('\n🟡 Starting Express server...');

   const port = 3000;

   const App = express();

   App.get('/', (req, res) => {
      return res.send('🟢 Server online. Expecting POST requests on /v0');
   });

   App.use(express.json());
   App.use(require('./routes'));

   App.listen(port, () => {
      console.log('\n🟢 $LINK PoC API listening on port', port);
   });

   const provider = await new Web3.providers.HttpProvider(
      'https://rinkeby.infura.io/v3/43598f8c3fcf439b8afee03a0044ac0e'
   );

   const web3 = new Web3(provider);

   const currentBlock = await web3.eth.getBlock('latest');

   console.log(
      '\n🟢 Connected to Rinkeby via',
      await web3.currentProvider.host
   );

   web3.eth.defaultAccount = '0xa4c4bff1e0e8d9ceb71d8394f38e7fdbeee109c4';

   console.log('\n🟢 Current block: ', currentBlock.number);

   console.log("\n🟢 Connected to Alice's account:", Alice.address);

   console.log('\n🟡 Instatiating contracts...');

   const tokenContract = await new web3.eth.Contract(
      TokenABI.abi,
      contractAddr
   );

   console.log(
      `\n🟢 Connected to token contract '${TokenABI.contractName}' at ${contractAddr}`
   );

   const amount = 10000;

   console.log(
      `\n🟢 Exchange account's balance: ${await tokenContract.methods
         .balanceOf('0xa4c4bfF1E0E8D9Ceb71D8394F38e7fDbeEe109c4')
         .call({ from: '0xa4c4bfF1E0E8D9Ceb71D8394F38e7fDbeEe109c4' })}`
   );

   console.log('\n🟡 Alice is trying to buy some $LINK...');

   // const tx = await tokenContract.methods
   //    .transfer(Alice.address, amount)
   //    .send(
   //       { from: '0xa4c4bff1e0e8d9ceb71d8394f38e7fdbeee109c4' },
   //       function (err, res) {
   //          if (err) {
   //             console.log('An error occured', err);
   //             return;
   //          }
   //          console.log('Hash of the transaction: ' + res);
   //       }
   //    );

   // console.log(
   //    `\n🟢 Alice bought ${amount} $LINK from the exchange's account: ${tx.transactionHash}`
   // );

   web3.eth.defaultAccount = Alice.address;

   console.log('\n🟡 Alice is trying to transfer some $LINK to Bob...');

   console.log(
      `\n🟢 Alice's $LINK balance before transfer: ${await tokenContract.methods
         .balanceOf(Alice.address)
         .call({ from: Alice.address })}`
   );

   console.log(
      `\n🟢 Bob's $LINK balance before transfer: ${await tokenContract.methods
         .balanceOf(Bob.address)
         .call({ from: Bob.address })}`
   );

   // TRANSFER
   // transferLink(Alice, Bob.address, amount);

   console.log(
      `\n🟢 Alice's $LINK balance after transfer: ${await tokenContract.methods
         .balanceOf(Alice.address)
         .call({ from: Alice.address })}`
   );

   console.log(
      `\n🟢 Bob's $LINK balance after transfer: ${await tokenContract.methods
         .balanceOf(Bob.address)
         .call({ from: Bob.address })}`
   );
}

startServer();
