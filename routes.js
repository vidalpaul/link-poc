const express = require('express');
const routes = express.Router();

const controller = require('./controller');

/** mínimo esperado na requisição:
{
  network: 'Ethereum',
  token: 'LINK',
  action: 'transfer'
}
*/

// Estilo RPC, há apenas 1 endpoint por versão:
routes.post('/v0', controller.parseRequest);

module.exports = routes;
