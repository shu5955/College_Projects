const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../../config');

/*
Local strategy for login
*/
module.exports = new PassportLocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    User.findOne({'local.email': email}, function(err, user) {
        if(err) {
          return done(err);
          }
        if(!user) {
            const error = new Error('Incorrect email or password');
            error.name = 'IncorrectCredentialsError';
            return done(error);
          }
        if(!user.validPassword(password)) {
             const error = new Error('Incorrect password');
             error.name = 'IncorrectPassword';
             return done(error);     
          }

        return done(null, user);
    });
  });

// /**

// Not anymore using JWT for security. Using hash when saving the user. 

//  * Return the Passport Local Strategy object.
//  */
// module.exports = new PassportLocalStrategy({
//   usernameField: 'email',
//   passwordField: 'password',
//   session: false,
//   passReqToCallback: true
// }, (req, email, password, done) => {
  


//   const userData = {
//     email: email.trim(),
//     password: password.trim()
//   };

//   console.log(userData);

//   //const email_val = User.local.email;

//   // find a user by email address
//   return User.findOne({'local.email': userData.email }, (err, user) => {

//     console.log("INSIDE THE LOCAL STRATEGY");
//     console.log(user.local);
//     console.log("The email is"+user.local.email);
//     console.log("The password is"+user.local.email);


//     if (err) { return done(err); }

//     if (!user) {
//       const error = new Error('Incorrect email or password');
//       error.name = 'IncorrectCredentialsError';

//       return done(error);
//     }

//     // check if a hashed user's password is equal to a value saved in the database
//     return user.comparePassword(userData.password, (passwordErr, isMatch) => {
//       if (passwordErr) { return done(passwordErr); }
//       console.log("WE ARE INSIDE THE COMPARE PASSWORD");
//       console.log("THE MATCH IS : "+isMatch);

//       if (!isMatch) {
//         const error = new Error('Incorrect email or password');
//         error.name = 'IncorrectCredentialsError';
//         return done(error);
//       }

//       const payload = {
//         sub: user._id
//       };

//       // create a token string
//       const token = jwt.sign(payload, config.jwtSecret);
      
//       const data = {};
    

//       return done(null, token, data);
//     });
//   });
// });


