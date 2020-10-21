var passport = require('passport');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');
const { NotExtended } = require('http-errors');

module.exports = (passport) => {
    
    // Serializes the user object into a session object when successfully authenticated.
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Returns the user object using the user id stored in the session object.
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    /**
     * Definition of local strategy used to authenticated a user. This strategy looks for the user email specified
     * in the db. Once user is confirmed to exist, we then do a match for the password. If password is a match
     * then we permit access for the user.
     */
    passport.use('local', new LocalStrategy({usernameField: "email", passwordField: "password", passReqToCallback: true}, 
        (req, email, password, done) => {
            User.findOne({email}, (err, user) => {
                if (err) throw err;

                if (!user) {
                    console.log('No data returned');
                    return done(null, false, req.flash('invalidAction', 'No user found for specified email'));
                }
                bcrypt.compare(password, user.password, (err, match) => {
                    if (err) throw err;

                    if (!match) {
                        console.log('Password provided does not match');
                        return done(null, false, req.flash('invalidAction', 'Username and password combination is incorrect'))
                    }

                    if (match) {
                        console.log('Password matches, user successfully logged in');
                        done(null, user), req.flash('successMatch', 'Successfully logged in, Welcome!');
                    }
                });
            });
        }
    ));
}