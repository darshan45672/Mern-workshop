const MONGO_URI = '';
import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        await connect(MONGO_URI);
        console.log('MongoDB connection SUCCESS');
    } catch (error) {
        console.log('MongoDB connection FAIL');
    }
};

// eslint-disable-next-line no-undef
module.exports = connectDB;
