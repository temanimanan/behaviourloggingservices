var mongoose = require('mongoose');

// Log Schema
var LogSchema = mongoose.Schema({
	username: {
		type: String
	},
	action: {
		type: String
	},
	timestamp: {
		type: Date,
		default: Date.now()
	}
});

var LogAction = module.exports = mongoose.model('LogAction', LogSchema);

module.exports.createLog = function(newLog, callback){
	newLog.save(callback);
};

module.exports.getLogByUsername = function(username, callback){
	var query = {username: username};
	LogAction.find(query, callback);
};

module.exports.getTotalCounts = function(callback){
	var query = [{"$group": {_id: "$action", count: {$sum: 1}}}, { $sort : { _id: 1 }}];
	LogAction.aggregate(query, callback);
};

module.exports.getCountsByUser = function(callback){
	var query = [{"$group": {_id: {username:"$username", action: "$action"}, count: {$sum: 1}}}, { $sort : { _id: 1}}];
	LogAction.aggregate(query, callback);
};