/* eslint-disable no-undef */
const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    postId:{
        type: Number,
        unique: true,
        default: 1,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    dateOfCreation: {
        type: Date,
        default: Date.now,
    },
    }
);

const blogPost = mongoose.model('blogPost', newSchema);

module.exports = blogPost;