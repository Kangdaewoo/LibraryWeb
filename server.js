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
var Transaction = require('./backendjs/model/transaction');
var Rating = require('./backendjs/model/rating');

var router = require('./backendjs/api/authentification/router');
app.use('/api', router);


app.get('/', function(req, res) {
    res.send('Hello world');
});
app.get('/getBooks', function(req, res) {
    const bookQuery = {
        title: req.query.title,
        author: req.query.author
    }
    Book.findBooks(bookQuery).then(function(books) {
        return res.json({success: true, books: books});
    }).catch(function(err) {
        return res.status(403).json({success: false, message: err.message});
    });
});
app.get('./getRatings', function(req, res) {
    const ratingQuery = {
        title: req.query.title,
        author: req.query.author
    }
    Rating.findRatings(ratingQuery).then(function(ratings) {
        return res.json({success: true, ratings: ratings});
    }).catch(function(err) {
        return res.status(403).json({success: false, message: err.message});
    });
});


app.post('/signUp', function(req, res) {
    const newCustomer = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name
    };
    Customer.createCustomer(newCustomer).then(function(customer) {
        res.json({success: true, message: 'Welcome!'});
    }).catch(function(err) {
        res.status(403).json({success: false, message: 'Username already exists!'});
    });
});


const port = 3005 || process.env.PORT;
var server = app.listen(port, function() {
    console.log('Running on localhost:%s', server.address().port);
});