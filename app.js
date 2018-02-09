var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
// session variables and body parser
var bodyParser = require('body-parser')
var flash = require('express-flash')
var app = express()

var morgan = require('morgan')
var cookieParser = require('cookie-parser')

app.use(morgan('dev')) // log every request to the console

app.use(flash()) // use connect-flash for flash messages stored in session

// db initialize sequelize
// load models
var models = require('./db')

models.sequelize.sync().then(function () {
  console.log('Nice! Database looks fine')
}).catch(function (err) {
  console.log(err, 'Something went wrong with the Database Update!')
})
// Sync Database in m
var m = models.sequelize.models

m.users
.findAndCountAll()
.then(result => {
  console.log(result.count)
  // console.log(result.rows)
})

app.use(cookieParser()) // read cookies (needed for auth)

// For BodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Configuring Passport
var passport = require('passport')
var expressSession = require('express-session')

// required for passport
app.use(expressSession({
  secret: 'gandalffumaporr0s',
  resave: true,
  saveUninitialized: true
})) // session secret

// app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions

// Initialize Passport
var initPassport = require('./passport/init')
initPassport(passport)

// app.use(expressValidator()); //validaciones de formularios

app.use(flash()) // use connect-flash for flash messages stored in session

// basic routes
var routes = require('./routes/index')(passport)
app.use('/', routes)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static(path.join(__dirname, '/public')))

// we cannot use req.session.variable in the views so we have to use an intermediate
// "local" variable to put this data and pass it to the view
// We can access our session variables from the view through the "session" variable
app.use(function (req, res, next) {
  res.locals.session = req.session
  res.locals.number = 0
  next()
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
