const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Book = new Schema({
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
        required: true,
        min: 0
    }
});
Book.index({title: 1, author: 1}, {unique: true});

Book.statics.findBook = function(query) {
    return this.findOne(query);
}

Book.statics.findBooks = function(query) {
    return this.find({
        titleAndAuthor: {
            '$regex': '.*' + query.title + '.* by .*' + query.author + '.*',
            '$options': 'i'
        }
    });
}

Book.statics.addBook = function(query) {
    const newBook = new this(query);
    return newBook.save();
}

Book.statics.borrow = function(query) {
    const update = function(book) {
        if (book.quantity > 0) {
            book.quantity -= 1;
            return book.save();
        } else {
            return null;
        }
    };
    return this.findBook(query).then(update);
}

module.exports = mongoose.model('Book', Book);