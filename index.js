const express = require('express');
const Web3 = require('web3');
const TokenABI = require('@chainlink/abi/v0.4/LinkToken.json');
const Alice = require('./Alice.json');
const Bob = require('./Bob.json');
const transfer = require('./transfer');

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

   // console.log('\n🟡 Alice is trying to buy some $LINK...');

   const tx = await tokenContract.methods
      .transfer(Alice.address, amount)
      .send(
         { from: '0xa4c4bff1e0e8d9ceb71d8394f38e7fdbeee109c4' },
         function (err, res) {
            if (err) {
               console.log('An error occured', err);
               return;
            }
            console.log('Hash of the transaction: ' + res);
         }
      );

   console.log(
      `\n🟢 Alice bought ${amount} $LINK from the exchange's account: ${tx.transactionHash}`
   );

   console.log(`\n🟢 Alice bought ${amount} $LINK`);

   web3.eth.defaultAccount = Alice.address;

   console.log('\n🟡 Alice is trying to transfer some $LINK to Bob...');

   transfer(Alice, Bob.address, amount);

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

async function transfer(symbol, from, pk, to, amount, gasPrice = null) {
   const token = 'LINK';
   console.log(
      `TokenTX.send(symbol: ${symbol}, to: ${to}, amount: ${amount}, gasPrice: ${gasPrice}, isMint: ${isMint})`
   );
   if (!token) {
      throw new Error('UNRECOGNIZED_TOKEN_ADDRESS');
   }

   console.log(`-> from: ${from}`);

   const functionSig = token.methods.transfer(to, amount).encodeABI();

   console.log(`-> functionSig: ${functionSig}`);

   const estimatedGas = await token.methods
      .transfer(to, amount)
      .estimateGas({ from, data: functionSig })
      .catch((e) => {
         console.log('tx', 'FAILED GAS ESTIMATION');
         throw e;
      });

   //    gasPrice = await this.resolveGas(gasPrice).catch((e) => {
   //       throw e;
   //    });

   //    const nonce = await this.resolveNonce(from).catch((e) => {
   //       BitfyNonceManager.resetNonce();
   //       throw e;
   //    });

   let config = {
      from,
      to,
      gas: estimatedGas,
      gasPrice,
      nonce,
      data: functionSig,
   };

   console.log(`-> tx: ${JSON.stringify(config, null, 2)}`);

   const pk = 0;

   const signedTx = await this.core.web3.eth.accounts
      .signTransaction(config, pk)
      .catch(async (e) => {
         const atLeast = e.message.split('least ')[1];
         config.gas = atLeast;

         console.log(`-> Gas too low. Adjusting to ${atLeast}`);

         return await web3.eth.accounts
            .signTransaction(config, pk)
            .catch((e) => {
               BitfyNonceManager.unmute();
               throw e;
            });
      });

   const hash = await this.promise
      .sendSignedTransaction(config, signedTx.rawTransaction)
      .catch((e) => {
         throw e;
      });

   console.log(`[token] tx ${nonce} sent: ${hash}`);

   return hash;
}

startServer();
