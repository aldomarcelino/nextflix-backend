const { tokenToPayload } = require("../helpers/tokengen");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    let accessToken = req.headers.access_token;
    let payload = tokenToPayload(accessToken);
    let user = await User.findByPk(payload.id, { raw: true });
    if (!user) throw { name: "Not_Valid" };
    delete user.password;
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
