'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateQuantity = function(quantity) {
    return Number.isInteger && quantity > 0;
}

const Book = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    // No duplicates.
    titleAndAuthor: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        validate: {
            validator: validateQuantity,
            message: '{VALUE} is not an integer or is less than 1.'
        }
    }
});

Book.statics.findBook = function(query) {
    return this.findOne(query);
}

Book.statics.findBooks = function(query) {
    return this.find(query);
}

Book.statics.addBook = function(query) {
    const newBook = new this(query);
    return newBook.save();
}

module.exports = mongoose.model('Book', Book);