const Web3 = require('web3');
const Contract = require('web3-eth-contract');
const TokenABI = require('@chainlink/abi/v0.4/LinkToken.json');

console.log('Starting...');

const provider = new Web3.providers.HttpProvider(
   'https://rinkeby.infura.io/v3/43598f8c3fcf439b8afee03a0044ac0e'
);

const web3 = new Web3(provider);

console.log('Connected to Rinkeby network via', web3.currentProvider.host);

// async addAccountToWallet(account) {
//    this.core.web3.eth.accounts.wallet.add(account);
//  }

//  async fromPk(privateKey) {
//    const acc = this.core.web3.eth.accounts.privateKeyToAccount(privateKey);
//    await this.addAccountToWallet(acc);

//    return acc;
//  }

//  async encryptWallet(password) {
//    if (!password) {
//      throw new Error('PASSWORD_MISSING');
//    }

//    const encryptedWallet = await this.core.web3.eth.accounts.wallet.encrypt(
//      password,
//    );

//    return encryptedWallet;
//  }

//  async decryptWallet(encryptedObject, password) {
//    this.cc.log('accounts', '--DECRYPT WALLET--');

//    this.core.web3.eth.accounts.wallet.clear(); //limpa a carteira atual para que ela seja substituída

//    try {
//      const wallet = await this.core.web3.eth.accounts.wallet.decrypt(
//        encryptedObject,
//        password,
//      );

//      this.cc.log('accounts', 'Wallet Restored.');

//      //Connects the first account:
//      let firstAcc = await this.fromWallet();
//      await this.core.connect(firstAcc);

//      return wallet;
//    } catch (e) {
//      throw new Error('CANNOT_DECRYPT_WALLET: ' + e.message);
//    }
//  }

console.log('Connected to', web3.eth.defaultAccount);
