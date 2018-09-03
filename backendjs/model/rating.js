const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Rating = new Schema({
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
    }
});

module.exports = mongoose.model('Rating', Rating);