const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

const pending = require('./routes/pending');
const quotes = require('./routes/quotes');
const random = require('./routes/random');
const submit = require('./routes/submit');
let app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/pending', pending);
app.use('/api/quotes', quotes);
app.use('/api/random', random);
app.use('/api/submit', submit);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Websites die when they are killed.');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = 'AnimeQuotes';
  // render the error page
  res.status(err.status || 500);
  res.json({'Error 404 Placeholder': 'lol'});
});

module.exports = app;
