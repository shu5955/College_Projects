var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config=require('./config');
var user= require('./models/user');

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user.id)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
 	user.findOne({_id:id},function(err, user){
 		console.log(user)
 		if(!err)
 		{
 			done(null, user);
 		}
 		else
 		{
 			done(err,null);
 		}
 	
 	});
});

passport.use(new GoogleStrategy({

        clientID        : '614676768333-ldiphi18gop17e1655lcdkui3mumu4hq.apps.googleusercontent.com',
        clientSecret    : 'G3yecz5ODR8d9lFPyxsDI2LU',
        callbackURL     : config.google.callbackURL
    },
    function(token, refreshToken, profile, done) {
    	console.log("----JUST BEFORE TICK ------: 2");
    	console.log(profile.emails[0].value);
    	// make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
	 	console.log("----REACHEDINTICK----:    3");
	 	var query = user.findOne({ 'email' : profile.emails[0].value });

	 	query.exec(function (err,oldUser)
	 	{
	 		console.log("----REACHEDINEXEC----:    4");
	 		if(oldUser)
	 		{
	 				console.log("A Registered User Found :"+ oldUser.name);
	 				done (null,oldUser);
	 		}else
	 		{
	 				var newUser =new user();
	 				newUser.name=profile.displayName;
	 				newUser.email=profile.emails[0].value;
	 				console.log(newUser);
	 				newUser.save(function(err){
	 					if(err)
	 					{
	 						throw err;
	 					}
	 					console.log("New user, "+newUser.name+ "added");
	 					done(null,newUser);
	 				});	 				
	 		}	 	
	 	
	 	});
        });
    }));



module.exports=passport;