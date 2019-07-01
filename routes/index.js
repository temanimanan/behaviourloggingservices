var express = require('express');
var router = express.Router();

var User = require('../models/user');
var UserLoginData = require('../models/userlogin');
var LogAction = require('../models/logaction');

var username = null;
var userlogindata = null;
var useractiondata = null;

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){	
	username = req.user.username;
	
	getuserlogindata(function(){
		getuseractiondata(function(){
			res.render('index', {
				username:username,
				userlogindata:userlogindata,
				useractiondata:useractiondata
			});
		});
	});
});

router.get('/getData', ensureAuthenticated, function(req, res){	
	res.setHeader('Content-Type', 'application/json');

	getuserlogindata(function(){
		getuseractiondata(function(){
			res.send(JSON.stringify({
				username:username,
				userlogindata:userlogindata,
				useractiondata:useractiondata
			}));
		});
	});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
};

function getuserlogindata(success){
	UserLoginData.getUserLoginByUsername(username, function(err, data){
		if(err) throw err;
		//console.log(data);
		userlogindata = data;
		console.log("Got User Log!!!");
		success();
	});
};

function getuseractiondata(success){
	LogAction.getLogByUsername(username, function(err, data){
		if(err) throw err;
		//console.log(data);
		useractiondata = data;
		console.log("Got User Actions!!!");
		success();
	});
};

module.exports = router;