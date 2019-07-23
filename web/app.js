var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var queryRouter = require('./routes/query');
var csvRouter = require('./routes/csv');

// connect to mongodb at start of app so don't have to reconnect for every query
// if mongodb isn't online at the time, just ignore the console logged errors
var mongoose = require('mongoose');
mongoose.connect('mongodb://mongos0:27017/boat', {useNewUrlParser: true});
var mongodb = mongoose.connection;
mongodb.on('connected', () => {
	console.log("Connected to mongodb");
});
mongodb.on('error', (err) => {
	console.log("Error connecting to mongo");
	console.log(err);
	console.log("Error connecting to mongo");
});
mongodb.on('disconnected', () => {
	console.log("Mongo connection disconnected");
});
process.on('SIGINT', () => {  
  mongodb.close(() => { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/query', queryRouter);
app.use('/csv', csvRouter);

module.exports = app;
