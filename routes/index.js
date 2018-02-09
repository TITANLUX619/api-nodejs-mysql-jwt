var express = require('express')
var router = express.Router();


// configuration ===============================================================
// connect to our database

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}



module.exports = function(passport){
	var passport = require('passport');
	var pagesController = require('../controllers/pagesController.js');
	var userCtrl = require('../controllers/userController.js');
	var flash    = require('connect-flash');
	var exec = require('child_process').exec;
	const auth = require('../middleware/auth')




	router.get('/', pagesController.index);
	router.get('/dashboard', isAuthenticated, pagesController.home);



/* GET login page. */
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('login', {message: req.flash('error')});
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('local-signin', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('signup', {message: req.flash('error')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/dashboard',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* Logout */
	router.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/'); //Can fire before session is destroyed?
	});


	router.post('/api/signup', userCtrl.signUp)
	router.post('/api/signin', userCtrl.signIn)

	router.get('/api/private', auth, (req, res) => {
	  res.status(200).send({ message: 'Tienes acceso' })
	})

	router.get('/signin', function(req, res) {
			// Display the Login page with any flash message, if any
		res.render('/api/signin', { message: req.flash('message') });
	});





return router;
}
