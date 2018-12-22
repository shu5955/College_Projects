var passport = require('passport');
var config = require('./oauth.js');
var FacebookStrategy = require('passport-facebook').Strategy;
const User = require('mongoose').model('User');
const configuration = require('../../config');

/*
Passport stategy for facebook login. 
*/


module.exports = passport.use( new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL,  
  profileFields: ['id', 'displayName', 'emails', 'photos'],
  passReqToCallback : true
  },
   function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      if(!req.user) {
        User.findOne({'social.fb.id': profile.id }, function(err, user) {
          if (err) {
            console.error('There was an error accessing the dbase', err.message);
            return done(err);
            }
          if (user) {
              return done(null, user);
            }
          else {
              var newUser = new User();
              newUser.social.fb.id = profile.id;
              newUser.social.fb.token = accessToken;
              newUser.social.fb.displayName = profile.displayName;
              newUser.social.fb.email = profile.emails[0].value;
              newUser.social.fb.photo = profile.photos[0].value || '';
            //  console.log("Saved a new user and here is the detail : " + newUser);

              newUser.save(function(err) {
                  if (err) {
                    console.error(err);
                    return done(err);
                  }
                  return done(null, newUser);
              });
            }
          }
        );
      }
      else {//user exists and is loggedin
        var user = req.user; // pull the user out of the session
        // update the current users facebook credentials

        user.social.fb.id = profile.id;
        user.social.fb.token = accessToken;
        user.social.fb.displayName = profile.displayName;
        user.social.fb.email = profile.emails[0].value;
        user.social.fb.photo = profile.photos[0].value || '';

         //console.log("User exists and is logged in : " + user);

        // save modifications to user
        user.save(function(err) {
          if (err) {
            console.error(err);
            return done(err);
          } 
          return done(null, user);
        });
      }
    })}

));

