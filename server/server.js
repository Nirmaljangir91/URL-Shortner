require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 2006;
const connectDB = require('./config/db.config');
const urlRoutes = require('./routes/Url.route.js');

// connect to the database
connectDB()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); 
console.log(process.env.FRONTEND_URL);

app.use('/', urlRoutes);

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
