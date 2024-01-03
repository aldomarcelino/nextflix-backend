const { payloadToToken } = require("../helpers/tokengen");
const { compareThePass } = require("../helpers/encryption");
const { User, Genre, Casts, MovieCasts } = require("../models");
const { OAuth2Client } = require("google-auth-library");

class Controller {
  static async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!password || !email) throw { name: "empthy" };
      let user = await User.findOne({ where: { email }, raw: true });
      if (!user) throw { name: "Not_Valid" };
      let isValid = compareThePass(password, user.password);
      if (!isValid) throw { name: "Not_Valid" };
      let accessToken = payloadToToken({
        id: user.id,
        email: user.email,
      });
      delete user.password;
      res.status(200).json({ accessToken, user });
    } catch (err) {
      next(err);
    }
  }

  static async signUp(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      let data = (
        await User.create({
          username,
          email,
          password,
          phoneNumber,
          address,
        })
      ).get({ plain: true });
      delete data.password;
      res.status(201).json({ message: "user created successfully", data });
    } catch (err) {
      next(err);
    }
  }

  static async signInWithGoogle(req, res, next) {
    try {
      const client = new OAuth2Client(process.env.googleClientId);
      const ticket = await client.verifyIdToken({
        idToken: req.headers.google_token,
        audience: process.env.googleClientId,
      });
      const payload = ticket.getPayload();
      const [user, created] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          username: `${payload.given_name} ${payload.family_name}`,
          email: payload.email,
          password: "Bismillah",
          role: "Staff",
        },
      });
      let accessToken = payloadToToken({
        id: user.id,
        email: user.email,
      });
      delete user.password;
      res.status(200).json({ accessToken, user, img: payload.picture });
    } catch (err) {
      next(err);
    }
  }

}

module.exports = Controller;
