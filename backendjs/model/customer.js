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
    transactions: [{
        title: {
            type: String
        },
        author: {
            type: String
        },
        date: {
            type: Date
        }
    }]
});
Customer.index({name: 1}, {unique: true});

const crypto = require('crypto');
const config = require('../config');
Customer.statics.createCustomer = function(query) {
    const newCustomerQuery = {
        name: query.name,
        logins: {
            username: query.username,
            password: crypto.createHmac('sha1', config.secret).update(query.password).digest('base64')
        }
    };

    const newCustomer = new this(newCustomerQuery);
    return newCustomer.save();
}

Customer.statics.findCustomer = function(query) {
    const customerQuery = {
        'logins.username': query.username,
        'logins.password': crypto.createHmac('sha1', config.secret).update(query.password).digest('base64')
    };
    return this.findOne(customerQuery);
}

Customer.statics.borrow = function(query) {
    return this.findOne({name: query.name}).then(customer => {
        customer.transactions.push({
            title: query.title,
            author: query.author,
            date: new Date()
        });
        return customer.save();
    });
}

module.exports = mongoose.model('Customer', Customer);