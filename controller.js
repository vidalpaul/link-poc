async function parseRequest(req, res) {}

async function buy(req, res) {
   const { amount } = req.body;
   const { address } = req.body;
}

async function transfer(req, res) {
   const { amount } = req.body;
   const to = req.body.address;
   const { from } = req.body;
}

module.exports = {
   parseRequest,
};
