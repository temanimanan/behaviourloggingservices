var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var UserLoginData = require('../models/userlogin');
var LogAction = require('../models/logaction');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	
		if(errors){
			res.render('register',{
				errors:errors
			});
		} else {
			var newUser = new User({
				username: username,
				password: password
			});
	
			User.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
			});
	
			req.flash('success_msg', 'You are registered and can now login');
	
			res.redirect('/users/login');
		}
});

passport.use(new LocalStrategy(
	function(username, password, done) {
	 User.getUserByUsername(username, function(err, user){
		 if(err) throw err;
		 if(!user){
			 return done(null, false, {message: 'Unknown User'});
		 }
  
		 User.comparePassword(password, user.password, function(err, isMatch){
			 if(err) throw err;
			 if(isMatch){
				 return done(null, user);
			 } else {
				 return done(null, false, {message: 'Invalid password'});
			 }
		});
	});
}));
  
passport.serializeUser(function(user, done) {
	done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});
  
router.post('/login',
passport.authenticate('local', {failureRedirect:'/users/login',failureFlash: true}),
	function(req, res) {
		var newUserLoginData = new UserLoginData({
			username: req.user.username
		});
	
		UserLoginData.createUserLoginData(newUserLoginData, function(err, userLoginData){
			if(err) throw err;
			console.log(userLoginData);
		});

		res.redirect('/');
});
  
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});
	
router.post('/action', function(req, res){
	var logAction = req.body.logEvent;
	console.log("User Action:", logAction);

	res.send(logAction);

	if (logAction != "undefined") {
		console.log("Log Receieved Successfully!!!");

		var currentUser = req.user.username

		if(currentUser != null) {
			var newLog = new LogAction({
				username: currentUser,
				action: logAction
			});

			LogAction.createLog(newLog, function(err, logAction){
				if(err) throw err;
				console.log(logAction);
			});
		
			console.log("Logged Successfully!!!");
		}
		else {
			console.log("No User Logged In");
		}
	}	
})

module.exports = router;