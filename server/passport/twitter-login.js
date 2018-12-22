var passport = require('passport');
var config = require('./oauth.js');
var TwitterStrategy = require('passport-twitter').Strategy;
const User = require('mongoose').model('User');
const configuration = require('../../config');

/*
  The passport strategy for twitter login.
*/
module.exports =  passport.use( new TwitterStrategy({
  consumerKey: config.twitter.consumerKey,
  consumerSecret: config.twitter.consumerSecret,
  callbackURL: config.twitter.callbackURL,
  profileFields: ['id', 'displayName', 'username', 'photos', '_json'],
  passReqToCallback : true
    },
  function(req, accessToken, tokenSecret, profile, done) {
  process.nextTick(function() {
    if(!req.user) {//confirm that user not loggedin
      User.findOne({'social.twitter.id': profile.id }, function(err, user) {
        if (err) {
          console.error('There was an error accessing the dbase', err.message);
          return done(err);
          }
        if (user) {
            return done(null, user);
          }
        else {
          // creates a social user and adds data to it 
            var newUser = new User();
            newUser.social.twitter.id = profile.id;
            newUser.social.twitter.token = accessToken;
            newUser.social.twitter.displayName = profile.displayName;
            newUser.social.twitter.handle = profile.username;
            newUser.social.twitter.photo = profile.photos[0].value || '';
            newUser.social.twitter.metaData.location = profile._json.location;
            newUser.social.twitter.metaData.description = profile._json.description;
            newUser.save(function(err) {
                if (err) {
                  console.error(err);
                  return done(err);
                }
                return done(null, newUser);
            });
          }
        }
      )}
      else {
        //user exists and is loggedin
          var user = req.user; // pull the user out of the session
          // update the current users facebook credentials
          user.social.twitter.id = profile.id;
          user.social.twitter.token = accessToken;
          user.social.twitter.displayName = profile.displayName;
          user.social.twitter.handle = profile.username;
          user.social.twitter.photo = profile.photos[0].value || '';
          user.social.twitter.metaData.location = profile._json.location;
          user.social.twitter.metaData.description = profile._json.description;
          // save modifications to user
          user.save(function(err) {
            if (err) {
              console.error(err);
              return done(err);
            }
            return done(null, user);
          });
      }
    });
}));
 

