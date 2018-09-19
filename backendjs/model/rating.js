const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Rating = new Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        requried: true
    },
    author: {
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
});
Rating.index({username: 1, title: 1, author: 1}, {unique: true});


Rating.statics.createRating = function(query) {
    const newRating = new this(query);
    return newRating.save();
}

Rating.statics.findRating = function(query) {
    return this.findOne(query);
}

Rating.statics.findRatings = function(query) {
    return this.find(query);
}

Rating.statics.rerate = function(query, newComment) {
    if (newComment == null) {
        newComment = '';
    }
    return this.findOneAndUpdate(query, {'$set': {comment: newComment}});
}

module.exports = mongoose.model('Rating', Rating);