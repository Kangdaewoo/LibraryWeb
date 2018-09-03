var router = require('express').Router();
var authentification = require('./authentification');

const Book = require('../../model/book');
const Transaction = require('../../model/transaction');
const Rating = require('../../model/rating');
const ExpiredTransaction = require('../../model/expiredTransaction');

router.post('/authentificate', authentification.authentificate);
router.use(authentification.authentificated);


router.post('/addBook', function(req, res) {
    if (req.decoded.isAdmin) {
        const bookQuery = {
            title: req.body.title,
            author: req.body.author,
            quantity: req.body.quantity
        }
        Book.addBook(bookQuery).then(book => {
            return res.json({success: true, message: 'Book added successfully!'});
        }).catch(err => {
            res.status(403).json({success: false, message: err.message})
        });
    } else {
        return res.status(403).json({success: false, message: 'You have no permission to add a book!'});
    }
});
router.post('/rate', function(req, res, next) {
    const transactionQuery = {
        username: req.decoded.username,
        title: req.body.title,
        author: req.body.author
    }
    ExpiredTransaction.findTransaction(transactionQuery).then(function(transaction) {
        if (transaction) {
            const ratingQuery = {
                username: req.decoded.username,
                title: req.body.title,
                author: req.body.author,
                rating: req.body.rating
            };
            if (req.body.comment) {
                ratingQuery.comment = req.body.comment;
            }
            return Rating.createRating(ratingQuery);
        } else {
            res.status(403).json({success: false, message: 'You did not read this book!'});
            next();
        }
    }).then(function(rating) {
        return res.json({success: true, message: 'Rating recorded!'});
    }).catch(function(err) {
        return res.status(403).json({success: false, message: err.message});
    });
});


router.get('/getTransactions', function(req, res) {
    const transactionQuery = {username: req.decoded.username};
    Transaction.findTransactions(transactionQuery).then(function(transactions) {
        return res.json({success: true, transactions: transactions});
    }).catch(function(err) {
        return res.status(403).json({success: false, message: err.message});
    });
});


router.put('/borrow', function(req, res, next) {
    const transactionQuery = {
        username: req.decoded.username,
        title: req.body.title,
        author: req.body.author
    };
    Transaction.findTransaction(transactionQuery).then(function(transaction) {
        if (!transaction) {
            const bookQuery = {
                title: req.body.title,
                author: req.body.author
            }
            return Book.borrow(bookQuery);
        } else {
            res.status(403).json({success: false, message: 'You have already borrowed this book.'});
            next();
        }
    }).then(function(book) {
        if (book) {
            return Transaction.createTransaction(transactionQuery);
        } else {
            res.status(403).json({success: false, message: 'Not available!'});
            next();
        }
    }).then(function(book) {
        return res.json({success: true, message: 'Borrowed!'});
    }).catch(function(err) {
        return res.status(403).json({success: false, message: err.message});
    });
});
router.put('/return', function(req, res, next) {
    const transactionQuery = {
        title: req.body.title,
        author: req.body.author,
        username: req.decoded.username
    };
    Transaction.return(transactionQuery).then(function(transaction) {
        console.log('transaction1' + transaction);
        if (transaction) {
            return ExpiredTransaction.return(transactionQuery);
        } else {
            res.json({success: false, message: 'You did not borrow this book!'});
            next();
        }
    }).then(function(transaction) {
        if (transaction) {
            const bookQuery = {
                title: req.body.title,
                author: req.body.author
            }
            return Book.return(bookQuery);
        } else {
            res.status(403).json({success: false, message: 'You have already returned this book!'});
            next();
        }
    }).then(function(book) {
        return res.json({success: true, message: 'Returned!'});
    }).catch(function(err) {
        return res.status(403).json({success: false, message: err.message});
    });
});

module.exports = router;