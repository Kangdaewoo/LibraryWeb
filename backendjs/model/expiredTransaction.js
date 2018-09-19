const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExpiredTransaction = new Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    returnedDate: {
        type: Date,
        default: Date.now
    },
    borrowedDate: {
        type: Date,
        required: true
    }
});

ExpiredTransaction.statics.return = function(query) {
    const newTransaction = new this(query);
    return newTransaction.save();
};

ExpiredTransaction.statics.findTransaction = function(query) {
    return this.findOne(query);
}

ExpiredTransaction.statics.findTransactions = function(query) {
    return this.find(query);
}

module.exports = mongoose.model('ExpiredTransaction', ExpiredTransaction);