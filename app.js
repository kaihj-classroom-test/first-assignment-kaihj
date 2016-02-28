var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var Octokat = require('octokat');

var octoDev = new Octokat({
  username: "DevJones",
  password: "8077901b68f6743f6b1ddb772a23ddcb97b7b053",
  rootURL: 'https://octodemo.com/api/v3'
});

var octoKaren = new Octokat({
  username: "KarenPeters",
  password: "a0d83fe62d89441ebe3bd27f521e1da7decdd8e2",
  rootURL: 'https://octodemo.com/api/v3'
});


var app = express();

// create application/json parser
var jsonParser = bodyParser.json()

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

app.post('/', jsonParser, function (req, res) {

  if (!req.body) return res.sendStatus(400)


  var issueNumber   = req.body.issue.number;
  var issueName     = req.body.issue.title;
  var issueComment  = req.body.comment.body;


  if((issueComment.indexOf("feedback") > -1) && (issueName.indexOf("(a)") > -1)) {
    octoDev.repos('KaiOrg', 'meeting-time').issues(issueNumber).comments.create({body: "I think it's a great idea! :+1:"});
    octoKaren.repos('KaiOrg', 'meeting-time').issues(issueNumber).labels.create({name: 'enhancement'});
    octoKaren.repos('KaiOrg', 'meeting-time').issues(issueNumber).comments.create({body: "I agree! :smile: I have just updated the issue label."});
  }

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
