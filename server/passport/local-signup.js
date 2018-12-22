const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;

/*
Local strategy for signup 

*/
module.exports = new PassportLocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      if(!req.user) {
        User.findOne({'local.email': email}, function(err, user) {
        if(err) {
          console.error(err);
          return done(err);
          }
        if(user) {

          return done(null, false, {errMsg: 'email already exists'});
        }
        else {

          //creates a local user and saves it to the user model
            var newUser = new User();
            newUser.local.username = req.body.username;
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);
            req.session.user=req.body.username;
            newUser.save(function(err) {
              if(err) {
                if(err.message == 'User validation failed') {
                  return done(null, false, {errMsg: 'Please fill all fields'});
                }
                console.error(err);
                return done(err);
                }
              return done(null, newUser);
            });
          }
      });
    }
    else {//user exists and is loggedin
      var user = req.user; // pull the user out of the session
      // update the current users local credentials
      user.local.username = req.body.username;
      user.local.email = email;
      user.local.password = user.generateHash(password);
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
});




// /**
//  * Return the Passport Local Strategy object.
//  */
// module.exports = new PassportLocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   session: false,
//   passReqToCallback: true
// }, (req, email, password, done) => {
  
//   const newUser = new User();
//   newUser.local.email = email.trim();
//   newUser.local.password = password.trim();

//   newUser.save((err) => {
//     if (err) { return done(err); }

//     return done(null);
//   });
// });