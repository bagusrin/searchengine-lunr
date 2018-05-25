var express = require('express');

var logger = require('morgan');
var bodyParser = require('body-parser');
var search = require('./app/routes/search');
var connection = require('../config/db');
var jsonwebtoken = require("jsonwebtoken");
var cors = require("cors");

var app = express();

var publicDir = require('path').join(__dirname, '/../public');

connection.init();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function (err, decode) {

      if (err) req.user = undefined;

      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

search.configure(app);

app.options('*', cors());
app.use(function (req, res) {
  res.status(404).send({ statusCode: 404, message: req.originalUrl + ' not found' });
});

module.exports = app;
//# sourceMappingURL=app.js.map
