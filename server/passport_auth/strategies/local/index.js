const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const config = require('config');
const User = require('../../../models/account_models/user');

passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }).then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }
                    if (isMatch) {
                        return done(null, jwt.encode({ 
                            user_id: user._id
                         }, config.get('JWT.secret')));
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

module.exports = passport;
