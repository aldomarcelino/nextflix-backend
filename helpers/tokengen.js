const jwt = require("jsonwebtoken");

const payloadToToken = (payload) => jwt.sign(payload, process.env.KEY);
const tokenToPayload = (token) => jwt.verify(token, process.env.KEY);

module.exports = { payloadToToken, tokenToPayload };
