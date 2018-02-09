var fs = require("fs");
var request = require("request"),
	cheerio = require("cheerio");

exports.index = function(req, res, next) {
	res.render("index");
};


exports.home = function(req, res, next) {
	// console.log(req)
	user = req.session.passport.user;
	console.log(user);
	res.render("home", { user: user });
};
