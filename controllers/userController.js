'use strict'


var models = require("../db");
var m = models.sequelize.models;
const service = require('../services')
var bCrypt = require('bcrypt-nodejs');



function signUp(req, res) {
  m.users.findOne({ where: { username: req.body.username } }).then(function (user) {

    if (user) {
      return res.status(500).send({ message: `El usuario ya existe` })
    }

    else {
      var userPassword = createHash(req.body.password);
      var data =
        {
          username: req.body.username,
          password: userPassword
        };

      m.users.create(data).then(function (newUser, created) {
        if (!newUser) {
          if (err) res.status(500).send({ message: `Error inesperado` })
        }
        if (newUser) {
          return res.status(200).send({ token: service.createToken(newUser) })
        }
      });
    }
  }).catch(function (err) {
    console.log("Error:", err);
    return res.status(500).send({ message: `Something went wrong with your SignUp.` })
  });

}


function signIn(req, res) {

  var isValidPassword = function (userpass, password) {
    return bCrypt.compareSync(password, userpass);
  }

  m.users.findOne({ where: { username: req.body.username } }).then(function (user) {

    if (!user) {
      return res.status(404).send({ message: `username does not exist` })
    }

    if (!isValidPassword(user.password, req.body.password)) {
      return res.status(500).send({ message: `Incorrect password.` })
    }

    res.status(200).send({
      message: 'Te has logeado corréctamente',
      token: service.createToken(user)
    })

  }).catch(function (err) {
    console.log("Error:", err);
    return res.status(500).send({ message: `Something went wrong with your Signin.` })
  });

}

// Generates hash using bCrypt
var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = {
  signUp,
  signIn
}

