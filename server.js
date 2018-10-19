var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Log events.
var morgan = require('morgan');
app.use(morgan('dev'));

var config = require('./backendjs/config');
app.set('superSecret', config.secret);
var mongoose = require('mongoose');
mongoose.connect(config.mongoUri, {useNewUrlParser: true});

var Customer = require('./backendjs/model/customer');
var Book = require('./backendjs/model/book');

var router = require('./backendjs/api/authentication/router');
app.use('/api', router);


app.get('/', function(req, res) {
    res.send('Hello world');
});



app.post('/customer', function(req, res) {
    const newCustomer = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };

    Customer.createCustomer(newCustomer).then(function(customer) {
        res.json({success: true, customer: newCustomer});
    }).catch(function(err) {
        res.status(403).json({success: false, message: err.message});
    });
});


app.get('/book', function(req, res) {
    const query = {
        title: req.query.title,
        author: req.query.author
    }

    Book.findBook(query).then(book => {
        if (!book) {
            return res.json({success: true, message: "No such book"});
        }

        return res.json({success: true, book: book});
    }).catch(err => {
        return res.json({success: false, message: err.message});
    });
});
app.get('/books', function(req, res) {
    const query = {
        title: req.query.title,
        author: req.query.author
    }

    Book.findBooks(query).then(books => {
        if (!books) {
            return res.json({success: true, message: "No such books"});
        }

        return res.json({success: true, books: books});
    }).catch(err => {
        return res.json({success: false, message: err.message});
    });
});


const port = 3005 || process.env.PORT;
var server = app.listen(port, function() {
    console.log('Running on localhost:%s', server.address().port);
});