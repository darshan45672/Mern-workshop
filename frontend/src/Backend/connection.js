/* eslint-disable no-undef */
const MONGO_URI = 'mongodb+srv://darshan123:darshan123@cluster0.rwz1zva.mongodb.net/blogDB?retryWrites=true&w=majority';
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI); 
        console.log('MongoDB connection SUCCESS');
    } catch (error) {
        console.log('MongoDB connection FAIL');
    }
};

// eslint-disable-next-line no-undef
module.exports = connectDB;
