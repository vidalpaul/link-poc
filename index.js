const Web3 = require('web3');
const Contract = require('web3-eth-contract');

const web3 = new Web3(Web3.providers.HttpProvider(process.env.HTTP_URL));
