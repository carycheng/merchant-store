var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var hbs = require("hbs");
require('dotenv').config()

// Set up routes to be used in Merchant App
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var dashboardRouter = require('./routes/dashboard');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
bs.registerPartials(__dirname + "/views/partials");

// Initialize session middleware
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize passport and session to be used with local passport strategy
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/*
 * Helper middleware to ensure that the user is authenticated through passport js
 * before allowing the passing the request to the next middleware to be handled.
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    next(); 
  } else {
    res.sendStatus(401);
  }
}

// Passing passport object into the passport service we are using
require('./config/passport')(passport);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', ensureAuthenticated, dashboardRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
