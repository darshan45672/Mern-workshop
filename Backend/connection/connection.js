const dotenv = require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;
// console.log(MONGO_URI);

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI); 
        console.log('MongoDB connection SUCCESS');
    } catch (error) {
        console.log('MongoDB connection FAIL');
    }
};

module.exports = connectDB;