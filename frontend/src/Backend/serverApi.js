/* eslint-disable no-undef */

const express = require('express');
const app = express();
const cors = require('cors');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectDB = require('./connection');
connectDB();

const port = 3001;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});