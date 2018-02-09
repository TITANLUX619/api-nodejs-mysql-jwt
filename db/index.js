"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var sqlizr = require('sqlizr')
var config = require('../config');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    // host: 'localhost',
    dialect: 'mysql',
    logging: false,
    freezeTableName: true,
    operatorsAliases: false
  }
)

var db = {};

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


var db = sqlizr(sequelize, './models/*.js')

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
