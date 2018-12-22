'use strict';
var UserModel = require('./user');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


module.exports = {

	//planning to use this signup controller in version 2
	signup: function(name, email, password){
		UserModel.insertOne( {
				"name": name,
				"email": email,
				"password": password
			},function(err, result){
				assert.equal(err, null);
		    	console.log("Saved the user sign up details.");
			});
	},
	//this returns the user profile to the server.js which returns it to the axios call from the react profile component. 
	getUserProfile: function(username, callback){
			UserModel.findOne( { email : username 
			},function(err, result){
				if(result==null){
					console.log('returning false')
					callback(false)
				}
				else{
					console.log('returning true')
					callback(result);
				}
			});
	},	//this updates the user profile. For development purposes, I am not using this code to update the profile. 
	//I am using the /profile route in server.js, but I will be moving that code here once all the profile work is completed 
	updateUserProfile: function(name, password, username, callback){
		  	UserModel.updateOne( 
		  		{ "email": username },
		  		{ $set: 
		  			{ "name" : name,
		  			  "password" : password 
		  			}
		  		},function(err, result){
				assert.equal(err, null);
		    	console.log("Updated user details.");
		    	if(err == null){
		    		callback(true)
		    	}
		    	else{
		    		callback(false)
		    	}
			});
		
	},
	//planning to use this method for login to keep everything tidy and organize. Will integrate in version 2. 
	validateSignIn: function(username, password,callback){
			
			UserModel.findOne( { email : username ,password: password 
			},function(err, result){
				if(result==null){
					console.log('returning false')
					callback(false)
				}
				else{
					console.log('returning true')
					callback(true)
				}
			});
	}
}
