var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dotenv = require('dotenv');
dotenv.config();

var indexRouter = require('./routes/index');
var queryRouter = require('./routes/query');
var csvRouter = require('./routes/csv');
var apiRouter = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/query', queryRouter);
app.use('/csv', csvRouter);
app.use('/api', apiRouter);

module.exports = app;
