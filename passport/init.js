var login = require("./login");
var signup = require("./signup");
var models = require("../db");
var m = models.sequelize.models;

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log("serializing user: ");
		console.log(user);
		done(null, user.id);
	});


	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		m.users.findById(id).then(function(user) {
			if(user){
				done(null, user);
				// done(null, user.get());
			}
			else{
				done(user.errors,null);
			}
		});
	});


	// Setting up Passport Strategies for Login and SignUp/Registration
	login(passport);
	signup(passport);

};
