const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Customer = new Schema({
    // name is what others will see the customer as.
    name: {
        type: String,
        unique: true,
        required: true
    },
    logins: {
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    transactions: {
        title: {
            type: String
        },
        author: {
            type: String
        },
        date: {
            type: Date
        }
    }
});


const crypto = require('crypto');
const config = require('../config');
Customer.statics.createCustomer = function(query) {
    query.logins.password = crypto.createHmac('sha1', config.secret).update(query.logins.password).digest('base64');
    const newCustomer = new this(query);
    return newCustomer.save();
}

Customer.statics.findCustomer = function(query) {
    query.password = crypto.createHmac('sha1', config.secret).update(query.password).digest('base64');
    return this.findOne(query);
}

module.exports = mongoose.model('Customer', Customer);