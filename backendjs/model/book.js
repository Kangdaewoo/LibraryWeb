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
        validate: {
            validator: function(q) {
                return Number.isInteger(q) && q >= 0;
            }
        }
    },

    ratings: {
        username: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 10
        },
        comment: {
            type: String,
            default: "",
            validate: {
                validator: function(comment) {
                    return comment.length <= 300;
                }
            }
        }
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
    const searchQuery = {title: query.title, author: query.author};
    return this.findOneAndUpdate(searchQuery, {'$inc': {quantity: query.quantity}}, {upsert: true});
}

Book.statics.borrow = function(query) {
    const update = function(book) {
        if (book.quantity > 0) {
            book.quantity -= 1;
            return book.save();
        } else {
            throw new Error('Book is not available!');
        }
    };
    return this.findBook(query).then(update);
}

Book.statics.return = function(query) {
    return this.findOneAndUpdate(query, {'$inc': {quantity: 1}});
}

module.exports = mongoose.model('Book', Book);