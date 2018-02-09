var LocalStrategy   = require("passport-local").Strategy;
var models = require("../db");
var m = models.sequelize.models;
var bCrypt = require("bcrypt-nodejs");

module.exports = function(passport){

	// passport.use('login', new LocalStrategy({
	//         passReqToCallback : true
	//     },
	//     function(req, username, password, done) {
	//         // check in mongo if a user with username exists or not
	// 					m.users.findOne({where: { username :  username } }, (err, user)=> {
	//                 // In case of any error, return using the done method
	//                 if (err)
	//                     return done(err);
	//                 // Username does not exist, log the error and redirect back
	//                 if (!user){
	//                     console.log('User Not Found with username '+username);
	//                     return done(null, false, req.flash('message', 'User Not found.'));
	//                 }
	//                 // User exists but wrong password, log the error
	//                 if (!isValidPassword(user, password)){
	//                     console.log('Invalid Password');
	//                     return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
	//                 }
	//                 // User and password both match, return user from done method
	//                 // which will be treated like success
	//                 return done(null, user);
	//             }
	//         );

	//     })
	// );


    







	//LOCAL SIGNIN
	passport.use("local-signin", new LocalStrategy(
    
		{

			// by default, local strategy uses username and password, we will override with user
			username : "username",
			password : "password",
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},

		function(req, username, password, done) {

			var User = username;

			var isValidPassword = function(userpass,password){
				return bCrypt.compareSync(password, userpass);
			};

			m.users.findOne({ where : { username: username}}).then(function (user) {

				if (!user) {
					return done(null, false, { message: "User does not exist" });
				}

				if (!isValidPassword(user.password,password)) {

					return done(null, false, { message: "Incorrect password." });

				}

				var userinfo = user.get();

				return done(null,userinfo);

			}).catch(function(err){

				console.log("Error:",err);

				return done(null, false, { message: "Something went wrong with your Signin" });


			});

		}
	));



	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, m.users.password);
	};


};
