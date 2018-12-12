var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var cors = require('cors')

mongoose.connect(config.database);

var login = require('./controller/login');
var program = require('./controller/program');
var event = require('./controller/event');
var user = require('./controller/user')
let s3 = require('./controller/s3.router.js');


var app = express();
app.use(cors())
app.use('/', s3);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(passport.initialize());

app.get('/', function(req, res) {
  res.send('Page under construction.');
});

app.use('/api', login);
app.use('/api', program);
app.use('/api', event);
app.use('/api',user)
app.use('/api',s3);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

/** Shutdown */

async function shutdown(callback) {
  await mongoose.disconnect();
  if (callback) callback();
  else process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.once('SIGUSR2', () => {
  shutdown(() => process.kill(process.pid, 'SIGUSR2'));
});

module.exports = app;