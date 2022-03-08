// Gerencia o nonce da carteira Bitfy de Ethereum, e apenas dela.

class EthNonceManager {
   constructor() {
      this.lastKnownNonce = 0;
      this.mutex = false;
   }

   setNonce(newNonce) {
      if (this.lastKnownNonce === 0 || this.lastKnownNonce < newNonce) {
         this.lastKnownNonce = newNonce;
      } else {
         console.log(
            `Warning: Tried to set nonce to ${newNonce} but the current nonce is ${this.lastKnownNonce}. Ignored.`
         );
      }
   }

   incrementNonce() {
      this.lastKnownNonce++;
      console.log(`Next Bitfy wallet nonce will be: ${this.lastKnownNonce}`);
   }

   reserveNonce() {
      const currentNonce = this.lastKnownNonce;
      this.incrementNonce();
      return currentNonce;
   }

   resetNonce() {
      this.lastKnownNonce = 0;
      console.log('***ETH NONCE RESET***');
   }

   mute() {
      this.mutex = true;
      console.log('***ETH MUTEX TUNRNED ON***');
   }

   unmute() {
      this.mutex = false;
      console.log('***ETH MUTEX TUNRNED OFF***');
   }

   isMuted() {
      return this.mutex;
   }

   setLastBitfyHash(hash) {
      this.lastBitfyHash = hash;
   }

   getLastBitfyHash(hash) {
      return this.lastBitfyHash;
   }
}

module.exports = new EthNonceManager();
