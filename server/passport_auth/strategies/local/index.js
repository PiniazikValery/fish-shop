const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../../models/account_models/user");
const UserToken = require("../../../models/account_models/user_token");

module.exports = () => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({username: username}).then(user => {
        if (user) {
          bcrypt.compare(password, user.password, async (err, isMatch) => {
            if (err) {
              throw err;
            }
            if (isMatch) {
              const genToken = (time, secret) =>
                jwt.sign(
                  {
                    user_id: user._id,
                  },
                  secret,
                  {expiresIn: time}
                );
              const refresh_token = genToken(
                config.get("JWT.refresh_token_life"),
                config.get("JWT.refresh_token_secret")
              );
              await UserToken.findOneAndDelete({user: user._id});
              const new_user_token = new UserToken({
                user: user._id,
                token: refresh_token,
              });
              await new_user_token.save();
              return done(null, {
                access_token: genToken(
                  config.get("JWT.access_token_life"),
                  config.get("JWT.access_token_secret")
                ),
                refresh_token,
              });
            } else {
              return done(null, false);
            }
          });
        } else {
          return done(null, false);
        }
      });
    })
  );
};
