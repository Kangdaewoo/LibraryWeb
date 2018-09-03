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
    quantity: {
        type: Number,
        default: 1,
        validate: {
            validator: function(quantity) {
                return Number.isInteger(quantity) && quantity >= 1;
            }
        }
    }
});
ExpiredTransaction.index({username: 1, title: 1, author: 1}, {unique: true});

ExpiredTransaction.statics.return = function(query) {
    return this.findOneAndUpdate(query, {'$inc': {quantity: 1}}, {upsert: true});
};

module.exports = mongoose.model('ExpiredTransaction', ExpiredTransaction);