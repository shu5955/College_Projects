const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define the User model schema

var UserSchema = mongoose.Schema({
  local: {
    username: String,
    email: {
      type: String,
      unique: true
      },
    password: String
    },
  social: {
    fb: {
      id: String,
      token: String,
      displayName: String,
      email: String,
      photo: String
      },
    twitter: {
      id: String,
      token: String,
      displayName: String,
      handle: String,
      photo: String,
      metaData: {
        location: String,
        description: String
        }
      },
      google: {
      id: String,
      token: String,
      displayName: String,
      email: String,
      photo: String
      }
    }
  });



/**
*Create schema methods
*/
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// Generating hash from the above functions now. Not anymore using the following methods
// /**
//  * Compare the passed password with the value in the database. A model method.
//  *
//  * @param {string} password
//  * @returns {object} callback
//  */
// UserSchema.methods.comparePassword = function comparePassword(password, callback) {
//   console.log("The local password is :"+ password);
//   console.log("The  password is :"+ this.local.password);
//   if(password.localeCompare(this.local.password)){
//     console.log("local");
//     callback(null, true);

//   }
//   else {

//     console.log("not local");

//         callback(null, false);
// }
//     // bcrypt.compare(password, this.local.password, function(err, isMatch) {
//     //     if (err) return cb(err);
//     //     callback(null, isMatch);
//     // });
// };


// *
//  * The pre-save hook method.
//  This is the method which is execute before the login/sign up botton. It creates a secret salt script by brcrypt module and merge it with user's password to get a secured hash string. This string is stored int he user's database model. 
 
// UserSchema.pre('save', function saveHook(next) {
//   const user = this;
//   console.log("The user pre is :"+ user);

//   // proceed further only if the password is modified or the user is new
//   if (!user.isModified('password')) return next();

//   return bcrypt.hash(user.local.password, 10, function(err, hash) {
//     if (err) { throw (err); }

//     bcrypt.compare(user.local.password, hash, function(err, result) {
//         if (err) { throw (err); }
//         console.log("The result is : "+ result);
//     });
// });
// });


module.exports = mongoose.model('User', UserSchema);