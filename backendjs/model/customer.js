'use strict';

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

Customer.statics.createCustomer = function(query) {
    const newCustomer = new this(query);
    return newCustomer.save();
}

Customer.statics.findCustomer = function(query) {
    return this.findOne(query);
}

module.exports = mongoose.model('Customer', Customer);