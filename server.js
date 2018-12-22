var path = require('path');
var express = require('express');
var session = require('express-session');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const passport = require('passport');
const configuration = require('./config');
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
const Auth=require("./Auth.js");
var User = require('./server/models/user');
var UserUtils = require('./server/models/userUtilities');
var UserProfile = require('./server/models/userProfileUtilities');
var redis = require("redis");
var RedisStore = require('connect-redis')(session);
var client  = redis.createClient();
var Cookies = require('universal-cookie');


/*
This is the main server file that uses express
*/


/*
Import of all the utility function from the userutility file. =
*/
var findUser = UserUtils.findUser,
  viewAllUsers = UserUtils.viewAllUsers,
  updateUser = UserUtils.updateUser,
  deleteUser = UserUtils.deleteUser;

/*
  load the mongo models 
*/
require('./server/models').connect(configuration.dbUri, {
  useMongoClient: true,
});
var port = 3000;
var app = express();
var compiler = webpack(config);


app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(require('express-session')({ secret: 'twitter_login', resave: true, saveUninitialized: true }));
//app.use(session({ secret: 'abc_123_def_456_ghi_789', resave: false, saveUninitialized: true }));
app.use(cookieParser("secret"));
// creates a server side session for the user. I am using redis store for faster access and secure location. 
app.use(session({
    store: new RedisStore({
        host: 'localhost',
        client: client,
        port: 6379,
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

//app.use(session({ store: new redisStore({}), secret: 'keyboard cat' }))



// redis errors
client.on('error', function(err) {
     console.log('Redis error: ' + err);
}); 


//passport session. 
app.use(passport.initialize());
app.use(passport.session());

// serialize user is callled when passport begins authenticated and generates a unique id. 
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// deserialize user is called when the passport is authenticating the user and use the unique id to get the user object. 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) {
      console.error('There was an error accessing the records of' +
      ' user with id: ' + id);
      return done(err);
    }
    //req.session.user=user;	
    return done(null, user);
  })
});

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

const googleLoginStrategy = require('./server/passport/google-login');
const facebookLoginStrategy = require('./server/passport/facebook-login');
const twitterLoginStrategy = require('./server/passport/twitter-login');

passport.use('google-login', googleLoginStrategy);
passport.use('twitter-login', twitterLoginStrategy);
passport.use('facebook-login', facebookLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);

app.use('/api', apiRoutes);

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email']}),
    function(req, res){
});

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {

    // social login is successful and the response was not null
    if (res==null){
      console.log("The response is null");
    }    
    // save the user in req session. 
   	req.session.key=req.user;
    // authenticate the user using facebook. 
    Auth.authenticateUser("FACEBOOK");
    res.cookie('route', 'social'); //set the cookie and mention that the route is social. Similar for all the other passport strategy for twitter and google
    res.redirect('/session'); // redirect to the session route 

  });

app.get('/auth/twitter',
  passport.authenticate('twitter',{ scope: ['email']}),
  function(req, res){
  });



app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    req.session.key=req.user;

   Auth.authenticateUser("Twitter");
   res.cookie('route', 'social');
    res.redirect('/session');
      

  });


app.get('/auth/google',
  passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ] }
));


app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    req.session.key=req.user;
   Auth.authenticateUser("Google");
   res.cookie('route', 'social');
   res.redirect('/session');
  });

// this is the auth routes and the middleware to return the user object and set the user session. 
app.use('/auth', authRoutes, function (req, res, next) {
 			console.log("*************I AM HERE*************");
 			console.log(res.locals.user);

			req.session.key = res.locals.user;
  			app.set('session', req.session.key);

		    return res.json({
		      success: true,
		      message: 'You have successfully logged in!',
		      token: res.locals.user
		    });
});

// the session route that access the session. 
app.get('/session', function (req, res, next) {
  app.set('session', req.session.key);
// I can store the values of the session in a variable here and transfer it later to the middleware. 
//res.redirect('/welcome');
//res.send(req.session.key);

res.redirect('/welcome');
  // if(!req.session.user){
 	// 		res.status(400).json({"data": "The reqest is null"});
  //  }else{

  //  		  console.log("from the session"+req.session.user);
  //         res.status(200).json(req.session.user);
  // }
});

// the update profile route to update user profile. 
app.post('/updateProfile', function (req, res, next){
            console.log("Inside update profile route");
            console.log(req.body.name);
            console.log(req.body.email);
// find the user by the unique mongo _id
 User.findById(req.body.id, function (err, user) {

        // todo: don't forget to handle err
        if (!user) {
            req.flash('error', 'No account found');
            return res.redirect('/');
        }
        // good idea to trim 
        var email = req.body.email.trim();
        var name = req.body.name.trim();
        // validate 
        if (!email || !name ) { // simplified: '' is a falsey
            req.flash('error', 'One or more fields are empty');
            return res.redirect('/'); // modified
        }
      if(req.body.route=='local'){
        // no need for else since you are returning early ^
        user.local.email = email; // why do you have two? oh well
        user.local.username = name;

      }
      else if(req.body.route=='fb')
      {
        user.social.fb.email = email; // why do you have two? oh well
        user.social.fb.displayName = name;
      } 
      else if(req.body.route=='twitter')
      {
        user.social.twitter.email = email; // why do you have two? oh well
        user.social.twitter.displayName = name;

      } else{
        user.social.google.email = email; // why do you have two? oh well
        user.social.google.displayName = name;
      }
       

        // don't forget to save!
        user.save(function (err) {
            req.session.key=user;
            app.set('session', req.session.key);
            res.redirect('/profile');
        });
    });

});

//the get session route returns the user session to the server. I am calling axios in react component to recieve this information. 
app.post('/getSession', function (req, res, next){
	console.log('*********The get session route********');
	console.log('*********Data below is ready to be sent to server********');
  console.log(app.get('session'));
    res.send(app.get('session'));
});




app.post('/getProfile', function (req, res, next){
console.log("This is the session variable in getProfile: " + req.session.key);
UserProfile.getUserInfo(req.session.key.email, function(result){
	console.log("This was the key:"+ req.session.key.email);
	console.log("This is the result:"+result);
    res.send(result)
  });

});


// this logs user out of the app and delete all the temporary information about the user 
app.get('/logout', function (req, res, next) {
		console.log(req.user);
        Auth.deauthenticateUser();
        req.logout();
        app.set('session', null);
		req.session.destroy();
        const cookies = new Cookies(req.headers.cookie);
        console.log(cookies.get('isLoggedIn'));
        cookies.remove('isLoggedIn', { path: '/' });
        res.clearCookie("isLoggedIn");
        res.clearCookie("route");
        console.log(req.user);
		    res.redirect('/');
});

//route to view all the user on the web app
app.get('/api/users', function (req, res, next) {
  return viewAllUsers(req, res, next);
});
//get information about a single user
app.route('/api/users/:email')
  .get(function (req, res, next) {
    return findUser(req, res, next);
  })
  .put(function (req, res, next) {
    return updateUser(req, res, next);
  })
  .delete(function (req, res, next) {
    return deleteUser(req, res, next);
  });



// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, function onAppListening(err) {
    if (err) {
        console.error(err);
    } else {
        console.info('==> 🚧  Webpack development server listening on port %s', port);
    }
});

