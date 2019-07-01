var mongoose = require('mongoose');

// UserLogin Schema
var UserLoginSchema = mongoose.Schema({
	username: {
		type: String
	},
	timestamp: {
		type: Date,
		default: Date.now()
	}
});

var UserLoginData = module.exports = mongoose.model('UserLoginData', UserLoginSchema);

module.exports.createUserLoginData = function(newUserLogin, callback){
	newUserLogin.save(callback);
};

module.exports.getUserLoginByUsername = function(username, callback){
	var query = {username: username};
	UserLoginData.find(query, callback);
};

module.exports.getuserlogins = function(callback){
	var query = [{"$group": {_id: {user: "$username", year: {"$year": "$timestamp"}, month: {"$month": "$timestamp"},day: {"$dayOfMonth": "$timestamp"}}, count: {"$sum": 1 }}}, { $sort: { _id: 1}}];
	UserLoginData.aggregate(query, callback);
};