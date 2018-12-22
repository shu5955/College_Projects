var mongoose=require('mongoose');
var config=require('../config');
var user = require('../models/user');

var jobSchema=new mongoose.Schema({
		title:String,
		url:String,
		user: {type: mongoose.Schema.Types.ObjectId, ref: user}

});
mongoose.Promise = global.Promise;
module.exports = mongoose.model('Job', jobSchema);