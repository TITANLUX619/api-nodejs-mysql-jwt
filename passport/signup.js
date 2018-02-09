var LocalStrategy   = require("passport-local").Strategy;
var models = require("../db");
var m = models.sequelize.models;
var bCrypt = require("bcrypt-nodejs");

module.exports = function(passport){

// 	passport.use('signup', new LocalStrategy({
// 		passReqToCallback : true // allows us to pass back the entire request to the callback
// 	},
// 	function(req, username, password, done) {
//
// 		findOrCreateUser = function(){
// 			// find a user in Mongo with provided email
// 			console.log('pruebaaaaaaa')
// 			m.users.findOne({
// 				// where: {username :  req.body.username}
// 				where: {username :  req.body.username}
// 			}).then(user, err => {
// 				// In case of any error, return using the done method
// 				if (err){
// 					console.log('Error in SignUp: '+err);
// 					return done(err);
// 				}
// 				// already exists
// 				if (user) {
// 					console.log('User already exists with email: '+email);
// 					return done(null, false, req.flash('message','User Already Exists'));
// 				} else {
// 					// if there is no user with that email
// 					// create the user
// 					var user = m.users.create({
// 						// email: req.body.email,
// 						username: req.body.username,
// 						password: createHash(req.body.password)
// 					});
//
// 				}
// 			})
// 		};
//
//
// 		// Delay the execution of findOrCreateUser and execute the method
// 		// in the next tick of the event loop
// 		process.nextTick(findOrCreateUser);
// 	})
// );


	passport.use("local-signup", new LocalStrategy(

		{
			username : "username",
			password : "password",
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},

		function(req, username, password, done){
		
		 m.users.findOne({where: {username:username}}).then(function(user){

				if(user)
				{
					return done(null, false, {message : "That user is already taken"} );
				}

				else
				{
					var userPassword = createHash(password);
					var data =
			{ username:username,
				password:userPassword
			};


					m.users.create(data).then(function(newUser,created){
						if(!newUser){
							return done(null,false);
						}

						if(newUser){
							return done(null,newUser);
						}
					});
				}
			});
		}
	));




	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
