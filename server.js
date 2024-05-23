// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()
var path = require('path'); // Add this line to require the path module

// Needed for EJS
app.set('view engine', 'ejs');

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Needed for Prisma to connect to database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

// Tells the app which port to run on
app.listen(8000);

// Serve static files from the main directory
app.use(express.static(__dirname));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve the index HTML page
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve the signup HTML page
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Route to serve the planner HTML page
app.get('/planner.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'planner.html'));
});

// Serve JSON data
app.get('/activities.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'activities.json'));
});