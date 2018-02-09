"use strict";

module.exports = function(sequelize, DataTypes) {

	var Users = sequelize.define("users", {

		username: { type: DataTypes.STRING },
		password: { type: DataTypes.STRING },
		email: { type: DataTypes.STRING },
		hash: { type: DataTypes.STRING },
		color: { type: DataTypes.STRING },
		firstname: { type: DataTypes.STRING },
		lastname: { type: DataTypes.STRING }

	});

	Users.sync();

	var user = Users.create({ username: "admin", password: "bocatadejamon" });

	return Users;
};
