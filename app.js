var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var Octokat = require('octokat');

var octo = new Octokat({
  username: "DevJones",
  password: "8077901b68f6743f6b1ddb772a23ddcb97b7b053",
  rootURL: 'https://octodemo.com/api/v3'
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// respond with "hello world" when a GET request is made to the homepage
//app.get('/', function(req, res) {
//  res.send('hello world');
//});

// Using an username/password
//var client = new GitHub({
//    username: "SamyPesse",
//    password: "my-password"
//});

app.post('/', function (req, res) {
  // You can omit `cb` and use Promises instead
  var cb = function (err, val) { console.log(val); };

  octo.zen.read(cb);
  octo.repos('KaiOrg', 'meeting-time').fetch(cb);    // Fetch repo info
  //octo.me.starred('KaiOrg', 'meeting-time').add(cb); // Star a repo
  //octo.me.starred('KaiOrg', 'meeting-time').remove(cb); // Un-Star a repo

  res.send('POST received');
  //res.send(req.params.issue.number);
  //res.json(req.params.number);
  //console.log('POST received');
  // Create an issue in a repository
  //console.log('POST received');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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


module.exports = app;
