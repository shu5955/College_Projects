var mongoose=require('mongoose');
var config=require('../config');
console.log(config);
//creating a user model 
	var userSchema = new mongoose.Schema({
			name: String,
			email: {type: String , lowercase:true}
			});
mongoose.Promise = global.Promise;
module.exports = mongoose.model('User', userSchema);