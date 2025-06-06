var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require("express-session")
const passport = require("passport")
const mongoose = require("mongoose")

var indexRouter = require('./routes/index');
var usersRouter = require('./models/users');

// const flash = require("connect-flash")

var app = express();

mongoose.connect("mongodb+srv://arbazalicoder2025:Dw89jPECH145VIdb@todoapp.jvnel9o.mongodb.net/TodoDb");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// -------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  resave: false,
  saveUninitialized:false,
  secret:"arbazkhan",
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

// app.use(flash());

// -------------------

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
