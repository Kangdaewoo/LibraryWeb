'use strict';

var router = require('express').Router();
var authentification = require('./authentification');

router.post('/authentificate', authentification.authentificate);
router.use(authentification.authentificated);

var Book = require('../../model/book');
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

module.exports = router;