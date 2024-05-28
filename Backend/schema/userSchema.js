const e = require('express');
const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const user = mongoose.model('user', newSchema);

module.exports = user;