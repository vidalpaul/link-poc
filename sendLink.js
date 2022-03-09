const Web3 = require('web3');
const TokenABI = require('@chainlink/abi/v0.4/LinkToken.json');
const Alice = require('./wallets/Alice.json');
const Bob = require('./wallets/Bob.json');
const Tx = require('ethereumjs-tx').Transaction;

async function sendLink() {
   const provider = await new Web3.providers.HttpProvider(
      'https://rinkeby.infura.io/v3/43598f8c3fcf439b8afee03a0044ac0e'
   );

   const web3 = new Web3(provider);

   const symbol = 'LINK';
   const from = Alice.address;
   const pk = Alice.privateKey;
   const to = Bob.address;
   const amount = 1000000;
   const gasPrice = null;

   const contractAddr = '0x01BE23585060835E02B77ef475b0Cc51aA1e0709';

   const tokenContract = await new web3.eth.Contract(
      TokenABI.abi,
      contractAddr
   );

   web3.eth.defaultAccount = Alice.address;

   web3.eth.transactionConfirmationBlocks = 1;

   console.log(
      `\n🟡 TokenTX.send(symbol: ${symbol}, to: ${to}, amount: ${amount}, gasPrice: ${gasPrice})`
   );
   if (!symbol) {
      throw new Error('\n🔴 UNRECOGNIZED_TOKEN_ADDRESS');
   }

   console.log(`-> from: ${from}`);

   const functionSig = await tokenContract.methods
      .transfer(to, amount)
      .encodeABI();

   console.log(`\n🟡 -> functionSig: ${functionSig}`);

   const estimatedGas = await tokenContract.methods
      .transfer(to, amount)
      .estimateGas({ from, data: functionSig })
      .catch((e) => {
         console.log('\n🔴 FAILED GAS ESTIMATION');
         throw e;
      });

   let transactionCount = await web3.eth.getTransactionCount(Alice.address);

   let rawTx = {
      from: Alice.address,
      nonce: transactionCount,
      gasPrice: 200000000000,
      gas: estimatedGas * 2,
      to: contractAddr,
      value: '0x0',
      data: tokenContract.methods.transfer(Bob.address, amount).encodeABI(),
   };

   let tx = new Tx(rawTx, { chain: 'rinkeby' });

   tx.sign(Buffer.from(pk, 'hex'));

   let serializedTx = tx.serialize();

   console.log(
      `\n🟡 Attempting to send signed tx:  ${serializedTx.toString('hex')}`
   );
   let receipt = await web3.eth.sendSignedTransaction(
      '0x' + serializedTx.toString('hex')
   );
   console.log(`\n🟢 Receipt info:  ${JSON.stringify(receipt, null, '\t')}`);

   // The balance may not be updated yet, but let's check
   balance = await tokenContract.methods.balanceOf(Alice.address).call();
   console.log(`\n🟢 Balance after send: ${balance}`);
}

sendLink();
