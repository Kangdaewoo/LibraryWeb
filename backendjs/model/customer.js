const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Customer = new Schema({
    // username and password are signIn info.
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    // name is what others will see the customer as.
    name: {
        type: String,
        unique: true,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});


const crypto = require('crypto');
const config = require('../config');
Customer.statics.createCustomer = function(query) {
    const encrypted = crypto.createHmac('sha1', config.secret).update(query.password).digest('base64');
    query.password = encrypted;
    const newCustomer = new this(query);
    return newCustomer.save();
}

Customer.statics.findCustomer = function(query) {
    const encrypted = crypto.createHmac('sha1', config.secret).update(query.password).digest('base64');
    query.password = encrypted;
    return this.findOne(query);
}

module.exports = mongoose.model('Customer', Customer);