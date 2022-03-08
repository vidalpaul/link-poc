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

   this.cc.log('yellow', `-> functionSig: ${functionSig}`);

   const estimatedGas = await token.methods
      .transfer(to, amount)
      .estimateGas({ from, data: functionSig })
      .catch((e) => {
         console.log('tx', 'FAILED GAS ESTIMATION');
         throw e;
      });

   gasPrice = await this.resolveGas(gasPrice).catch((e) => {
      throw e;
   });

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

   const pk = await this.accounts.getPkByAddress(from).catch((e) => {
      BitfyNonceManager.resetNonce();
      throw e;
   });

   const signedTx = await this.core.web3.eth.accounts
      .signTransaction(config, pk)
      .catch(async (e) => {
         const atLeast = e.message.split('least ')[1];
         config.gas = atLeast;

         console.log(`-> Gas too low. Adjusting to ${atLeast}`);

         return await this.core.web3.eth.accounts
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

module.exports = transfer;
