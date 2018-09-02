var router = require('express').Router();
var authentification = require('./authentification');

var Book = require('../../model/book');
var Transaction = require('../../model/transaction');

router.post('/authentificate', authentification.authentificate);
router.use(authentification.authentificated);


router.post('/addBook', function(req, res) {
    if (req.decoded.isAdmin) {
        Book.addBook(req.body).then(book => {
            return res.json({success: true, message: 'Book added successfully!'});
        }).catch(err => {
            res.status(403).json({success: false, message: err.message})
        });
    } else {
        return res.status(403).json({success: false, message: 'You have no permission to add a book!'});
    }
});


router.get('/getTransactions', function(req, res) {
    const transactionQuery = {username: req.decoded.username};
    Transaction.findTransactions(transactionQuery).then(function(transactions) {
        return res.json({success: true, transactions: transactions});
    }).catch(function(err) {
        return res.status(403).json({success: false, message: err.message});
    });
});


router.put('/borrow', function(req, res) {
    const bookQuery = {
        title: req.body.title,
        author: req.body.author
    };
    Book.borrow(bookQuery).then(function(book) {
        if (book === null) {
            return res.json({success: false, message: 'Not available!'});
        } else {
            const newTransaction = {
                username: req.decoded.username,
                title: book.title,
                author: book.author
            };
            Transaction.createTransaction(newTransaction).then(function(transaction) {
                return res.json({success: true, message: 'Borrowed!', transaction: transaction});
            });
        }
    }).catch(function(err) {
        return res.json({success: false, message: err.message});
    });
});
router.put('/return', function(req, res) {
    const transactionQuery = {
        title: req.body.title,
        author: req.body.author,
        username: req.decoded.username
    };
    Transaction.return(transactionQuery).then(function(transaction) {
        return res.json({success: true, message: 'Returned!'});
    }).catch(function(err) {
        return res.status(403).json({success: false, message: err.message});
    });
});

module.exports = router;