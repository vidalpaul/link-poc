const Web3 = require('web3');
const TokenABI = require('@chainlink/abi/v0.4/LinkToken.json');
const Alice = require('./wallets/Alice.json');
const Bob = require('./wallets/Bob.json');
const Exchange = require('./wallets/Exchange.json');
const Tx = require('ethereumjs-tx').Transaction;

const ETH_GAS_PER_TRANSACTION = '21500'; // para podermos enviar Ether para contratos não-maliciosos!

async function buyLink() {
   const provider = await new Web3.providers.HttpProvider(
      'https://rinkeby.infura.io/v3/43598f8c3fcf439b8afee03a0044ac0e'
   );

   const web3 = new Web3(provider);

   const symbol = 'LINK';
   const from = Exchange.address;
   const pk = Exchange.privateKey;
   const to = Alice.address;
   const gas = ETH_GAS_PER_TRANSACTION;
   const amount = 1000000;
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

   let transactionCount = await web3.eth.getTransactionCount(Exchange.address);

   let config = {
      from,
      to,
      gas: estimatedGas * 2,
      gasPrice: 200000000000,
      data: functionSig,
      nonce: transactionCount,
   };

   let rawTx = {
      from: Exchange.address,
      nonce: transactionCount,
      gasPrice: 200000000000,
      gas: estimatedGas * 2,
      to: contractAddr,
      value: '0x0',
      data: tokenContract.methods.transfer(Alice.address, amount).encodeABI(),
   };

   let tx = new Tx(rawTx, { chain: 'rinkeby' });

   tx.sign(Buffer.from(pk, 'hex'));

   let serializedTx = tx.serialize();

   console.log(
      `Attempting to send signed tx:  ${serializedTx.toString('hex')}`
   );
   let receipt = await web3.eth.sendSignedTransaction(
      '0x' + serializedTx.toString('hex')
   );
   console.log(`Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);

   // The balance may not be updated yet, but let's check
   balance = await tokenContract.methods.balanceOf(Alice.address).call();
   console.log(`Balance after send: ${balance}`);
}

buyLink();
