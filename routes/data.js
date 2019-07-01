var express = require('express');
var router = express.Router();

var LogAction = require('../models/logaction');
var UserLoginData = require('../models/userlogin');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('data');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
};

router.get('/responsedata1', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	
	gettotalcounts(function(data){
    	res.send(JSON.stringify({data}));
    });
});

router.get('/responsedata2', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	
	getcountbyuser(function(data){
    	res.send(JSON.stringify({data}));
    });
});

router.get('/responsedata3', function(req, res){
	res.setHeader('Content-Type', 'application/json');
	
	getuserlogins(function(data){
    	res.send(JSON.stringify({data}));
    });
});

function gettotalcounts(callback){
	LogAction.getTotalCounts(function(err, data){
		if(err) throw err; 
		//console.log(data);
		console.log("Got Total Count Data!!!");
		callback(data);
	});
};

function getcountbyuser(callback){
	LogAction.getCountsByUser(function(err, data){
		if(err) throw err; 
		//console.log(data);
		console.log("Got User Count Data!!!");
		callback(data);
	});
};

function getuserlogins(callback){
	UserLoginData.getuserlogins(function(err, data){
		if(err) throw err; 
		//console.log(data);
		console.log("Got User Login Data!!!");
		callback(data);
	});
};

module.exports = router;