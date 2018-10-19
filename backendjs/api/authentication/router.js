var router = require('express').Router();
var authentication = require('./authentication');

const Book = require('../../model/book');
const Customer = require('../../model/customer');
const ExpiredTransaction = require('../../model/expiredTransaction');

var config = require('../../config');
var session = require('express-session');
router.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}));

router.post('/auth/customer', authentication.authenticate);
router.use(authentication.authenticated);


router.post('/auth/book', function(req, res) {
    if (!req.decoded.isAdmin) {
        return res.json({success: false, isAdmin: req.decoded.isAdmin});
    }

    const query = {
        title: req.body.title,
        author: req.body.author,
        quantity: req.body.quantity
    }
    Book.addBook(query).then(() => {
        return res.json({success: true, message: 'Successfully added a book.'});
    }).catch(err => {
        return res.json({success: false, message: err.message});
    });
});


router.put('/auth/book', function(req, res) {
    if (req.session.transactions && req.session.transactions.length >= 10) {
        return res.json({success: false, message: 'You have borrowed too many books.'});
    }

    for (let i = 0; i < req.session.transactions.length; i++) {
        if (req.session.transactions[i].title == req.body.title ||
            req.session.transactions[i].author == req.body.author) {
            return res.json({success: false, message: 'You have already borrowed this book.'});
        }
    }

    const updateCustomer = function() {
        const query = {
            name: req.session.name,
            title: req.body.title,
            author: req.body.author
        };
        return Customer.borrow(query);
    };

    const query = {
        title: req.body.title,
        author: req.body.author
    };
    Book.borrow(query).then(updateCustomer).then(customer => {
        if (!customer) {
            return res.json({success: false, message: customer});
        }

        req.session.transactions = customer.transactions;
        return res.json({success: true, message: 'Successfully borrowed!'});
    }).catch(err => {
        return res.json({success: false, message: err.message});
    });
});

module.exports = router;