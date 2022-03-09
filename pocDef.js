async function transfer(encryptedObject, recipient, amount) {
   const { pk } = encryptedObject;
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

   let transactionCount = await web3.eth.getTransactionCount(Exchange.address);

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
}
