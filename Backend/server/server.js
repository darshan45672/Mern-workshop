const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser')

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectDB = require('../connection/connection');
connectDB();
const user = require('../schema/userSchema');

// console.log(dotenv.parsed);

const port = process.env.PORT || 3001;

// console.log(port);
const postApi = require('../api/post');
app.use('/', postApi);

const userApi = require('../api/user');
app.use('/', userApi);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});