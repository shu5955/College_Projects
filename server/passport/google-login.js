var passport = require('passport');
var config = require('./oauth.js');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('mongoose').model('User');
const configuration = require('../../config');

/*
Passport stategy for gogle login. 
*/

passport.use(new GoogleStrategy({
  clientID: config.google.clientID,
  clientSecret: config.google.clientSecret,
  callbackURL: config.google.callbackURL, 
  profileFields: ['id', 'displayName', 'emails', 'photos'],
  passReqToCallback : true
  },
  function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      if(!req.user){
        User.findOne({'social.google.id': profile.id }, function(err, user) {
          if (err) {
            console.error('There was an error accessing the dbase', err.message);
            return done(err);
            }
          if (user) {
              return done(null, user);
            }
          else {
            //create a user and add the data
              var newUser = new User();
              newUser.social.google.id = profile.id;
              newUser.social.google.token = accessToken;
              newUser.social.google.displayName = profile.displayName;
              newUser.social.google.email = profile.emails[0].value;
              newUser.social.google.photo = profile.photos[0].value || '';

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
        user.social.google.id = profile.id;
        user.social.google.token = accessToken;
        user.social.google.displayName = profile.displayName;
        user.social.google.email = profile.emails[0].value;
        user.social.google.photo = profile.photos[0].value || '';
                 console.log("User exists and is logged in : " + profile.emails[0].value);

        // save modifications to user
        user.save(function(err) {
          if (err) {
            console.error(err);
            return done(err);
          }
          //console.log('user fb', user.social.fb.displayName);
          //console.log('user fb tokens',user.social.fb.token);
          return done(null, user);
        });
      }
    });
    }));
