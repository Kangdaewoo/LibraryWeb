'use strict';

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var morgan = require('morgan');
app.use(morgan('dev'));

var config = require('./backendjs/config');
app.set('superSecret', config.secret);
var mongoose = require('mongoose');
mongoose.connect(config.mongoUri, {useNewUrlParser: true});

var Customer = require('./backendjs/model/customer');
var Book = require('./backendjs/model/book');

var router = require('./backendjs/api/authentification/router');
app.use('/api', router);

app.get('/', function(req, res) {
    res.send('Hello world');
});


app.post('/signUp', function(req, res) {
    Customer.createCustomer(req.body).then(function(customer) {
        res.json({success: true, message: 'Welcome!'});
    }).catch(function(err) {
        res.status(403).json({success: false, message: 'Username already exists!'});
    });
});

const port = 3008 || process.env.PORT;
var server = app.listen(port, function() {
    console.log('Running on localhost:%s', server.address().port);
});