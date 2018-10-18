var router = require('express').Router();
var authentication = require('./authentication');

const Book = require('../../model/book');
const Transaction = require('../../model/transaction');
const Rating = require('../../model/rating');
const ExpiredTransaction = require('../../model/expiredTransaction');

router.post('/authenticate', authentication.authenticate);
router.use(authentication.authenticated);




module.exports = router;