/**
 * Module dependencies.
 */


var express = require('express')
, path = require('path')

var favicon = require('serve-favicon')
, logger = require('morgan')
, methodOverride = require('method-override')
, bodyParser = require('body-parser')
, errorHandler = require('errorhandler');

var fs =require('fs');
var app = express();

// all environments
app.set('port',  3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

// routing
require('./app/routes.js')(app);

var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

