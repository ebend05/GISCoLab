var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//  Require Passport
var passport = require('passport');
var multer = require('multer');
var schedule = require('node-schedule');

//console.log(process.env.MY_SECRET);

//  Bring in the data model
require('./app_api/models/db');
//  Bring in the Passport config after model is defined
require('./app_api/config/passport');


//  Bring in the routes for the API (delete the default routes)
var routesApi = require('./app_api/routes/index');

// exec starts a shell as child-process, param is shell cmd as String
var exec = require('child_process').exec;

exec("mkdir projectData userTemps");



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//  Set the app_client folder to serve static resources
app.use(express.static(path.join(__dirname, 'app_client')));

//  Initialise Passport before using the route middleware
app.use(passport.initialize());

//  Use the API routes when path starts with /api
app.use('/api', routesApi);

//  Otherwise render the index.html page for the Angular SPA
//  This means we don't have to map all of the SPA routes in Express
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

//  Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.use(function(req, res, next) {
    console.log(req.method + ' ' + req.url + ' was requested by ' + req.connection.remoteAddress);

    res.header('Access-Control-Allow-Origin', '*');    // allow CORS
    next();
});

// clear out temps directory every day at 3am
var clearTemps = schedule.scheduleJob('0 0 3 0 0-6', function () {
    exec("rm -r userTemps/*");
    console.log(Date.now() +": cleared userTemps");
});

module.exports = app;
