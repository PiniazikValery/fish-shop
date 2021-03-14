const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../../models/account_models/user");

module.exports = () => {
  passport.use(
    new BearerStrategy((token, done) => {
      try {
        jwt.verify(token, config.get("JWT.access_token_secret"), function(err, decoded) {
          if (err) {
            return done(null, false);
          }
          return done(null, true);
        });
      } catch (error) {
        done(null, false);
      }
    })
  );
};
