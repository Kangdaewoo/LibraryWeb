const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Transaction = new Schema({
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
    }
});
Transaction.index({username: 1, title: 1, author: 1}, {unique: true});

Transaction.statics.createTransaction = function(query) {
    const newTransaction = new this(query);
    return newTransaction.save();
}

Transaction.statics.findTransaction = function(query) {
    return this.findOne(query);
}

Transaction.statics.findTransactions = function(query) {
    return this.find(query);
}

Transaction.statics.return = function(query) {
    return this.findOneAndRemove(query);
}

module.exports = mongoose.model('Transaction', Transaction);