const Web3 = require('web3');
const TokenABI = require('@chainlink/abi/v0.4/LinkToken.json');
const Alice = require('./wallets/Alice.json');
const Bob = require('./wallets/Bob.json');
const Exchange = require('./wallets/Exchange.json');

async function buyLink() {
   const provider = await new Web3.providers.HttpProvider(
      'https://rinkeby.infura.io/v3/43598f8c3fcf439b8afee03a0044ac0e'
   );

   const web3 = new Web3(provider);

   const symbol = 'LINK';
   const from = Exchange.address;
   const pk = Exchange.privateKey;
   const to = Alice.address;
   const amount = 100000;
   const gasPrice = null;

   const contractAddr = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';

   const tokenContract = await new web3.eth.Contract(
      TokenABI.abi,
      contractAddr
   );

   web3.eth.defaultAccount = Exchange.address;

   web3.eth.transactionConfirmationBlocks = 1;

   console.log(
      `TokenTX.send(symbol: ${symbol}, to: ${to}, amount: ${amount}, gasPrice: ${gasPrice})`
   );
   if (!symbol) {
      throw new Error('UNRECOGNIZED_TOKEN_ADDRESS');
   }

   console.log(`-> from: ${from}`);

   const functionSig = await tokenContract.methods
      .transfer(to, amount)
      .encodeABI();

   console.log(`-> functionSig: ${functionSig}`);

   const estimatedGas = await tokenContract.methods
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
      gas: estimatedGas * 200,
      gasPrice: 10000000000,
      data: functionSig,
      nonce: 15,
   };

   console.log(`-> tx: ${JSON.stringify(config, null, 2)}`);

   const signedTx = await web3.eth.accounts
      .signTransaction(config, pk)
      .catch(async (e) => {
         const atLeast = e.message.split('least ')[1];
         config.gas = atLeast;

         console.log(`-> Gas too low. Adjusting to ${atLeast}`);

         return await web3.eth.accounts
            .signTransaction(config, pk)
            .catch((e) => {
               throw e;
            });
      });

   const hash = await web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .on('receipt', console.log);

   console.log(`[token] tx sent: ${hash}`);

   return hash;
}

buyLink();
