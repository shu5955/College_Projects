var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var request = require('request');
var mongoose = require('mongoose')
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var methodOverride = require('method-override');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(methodOverride()); 
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname,'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setting up environment by updating the middleware to handle sessions and passport initialization. 
app.set('port',process.env.PORT || 3000);
app.set('views',__dirname + '/views');

passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id)
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    console.log(user)
    if(!err) 
    	{
    		done(null, user);
    	}
    else {
    		done(err, null);
    	}
  })
});

 
 app.get('/auth/google', passport.authenticate('google', {
  					scope : ['profile', 'email']
  
   }));


    //the callback after google has authenticated the user
app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : 'http://localhost:3000/search',
                    failureRedirect : 'http://localhost:3000/'
            }));

passport.use(new GoogleStrategy({

        clientID        : '614676768333-ldiphi18gop17e1655lcdkui3mumu4hq.apps.googleusercontent.com',
        clientSecret    : 'G3yecz5ODR8d9lFPyxsDI2LU',
        callbackURL     : 'http://localhost:3000/auth/google/callback'
    },
    function(token, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            // try to find the user based on their google id
            User.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser = new User();
                    console.log(profile.id);
                    // set all of the relevant information
                    newUser.oauthID   = profile.id;
                    // newUser.google.token = token;
                    // newUser.google.name  = profile.displayName;
                    // newUser.google.email = profile.emails[0].value; // pull the first email
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            {throw err;}
                    	console.log(newUser);
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
//Testing authentication
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
	return next();
	}
return next();

}
function ensureAuthenticatedSearch(req, res, next){
	if(req.isAuthenticated()){
	return next();
	}
	foo(req,res);
}


// the request made here
app.get('/', function(req, res) {
res.render('index', { user: req.user });
});
var foo = function(req, res){
 // we are here 
 
 console.log("INSIDE FOO");
  var val = req.query.search; // input from search
  // yql ur used for scraping 
  var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20craigslist.search" +
"%20where%20location%3D%22ames%22%20and%20type%3D%22jjj%22%20and%20query%3D%22" + val + "%22&format=" +
"json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
  requests(url,function(data){
    res.send(data);
  });
}

// on a succesful authentication(see below). This route sets the user after ensuring the authentication send the rendered view to the client(res.render).
app.get('/searching', ensureAuthenticated, foo , function(req,res){
	res.render('searching',{user:req.user});
});



// search the craigslist using the yql url provided. then send the request to the main page for display. 
app.get('/search', foo);

// defined routes for our node.js authentication
// This route initialise the authenticate procedure
app.get('/auth/google',passport.authenticate('google'),function(req,res){});
app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.google.com/m8/feeds' }));

This is the authenticating route on faliure it sets the result to homepage and on success it redirects it to the searching
app.get('/auth/google/callback', passport.authenticate('google',{failureRedirect:'/'}),function(req,res){res.redirect('/searching');});
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('http://localhost:3000/searching');
  });
  
  
  
 
    
// this is the logout route. It requests a logout call and redirect the result to the homepage
app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/');
});


// function responsible for gathering the data using the yql url and responsible for extracting crucial details. 
function requests(url, caller) {
  // request module for yql url and return the results in JSON format
  request(url, function(err, resp, body) {
    var resultsList = []; // array of jobs
  body = JSON.parse(body);
  
  // logic used to compare search results with the input from user
  if (!body.query.results.RDF.item) {
    results = "No results found. Try again.";
    caller(results);
  } else {
    results = body.query.results.RDF.item;
    for (var i = 0; i < results.length; i++) {
      resultsList.push(
        {title:results[i].title[0], about:results[i]["about"], desc:results[i]["description"]}
      );
    };
  };
    // pass back the results to client side
    caller(resultsList);
  });
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/craigslist');
var User = mongoose.model('User', {
  oauthID: Number
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
