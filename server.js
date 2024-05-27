// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express');
var app = express();
var path = require('path'); // Add this line to require the path module

// Needed for EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Specify the views directory

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));


// Needed for Prisma to connect to database
const { PrismaClient } = require('@prisma/client');
const { read, readSync } = require("fs");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { hash } = require("crypto");

// Tells the app which port to run on
app.listen(8000);

// Serve static files from the main directory
app.use(express.static(__dirname));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, "js")));

// Route to serve the main page
app.get('/', (req, res) => {
    res.render('index');
});

// Route to serve the signup HTML page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Route to serve the planner HTML page
app.get('/planner', (req, res) => {
    res.render('planner', {data: " "});
});

// Serve JSON data
app.get('/activities.json', (req, res) => {
    res.render('activities.json');
});

// Route to serve the seoul HTML page
app.get('/seoul', (req, res) => {
    res.render('seoul');
});

//Problem Statement page
app.get('/problemstatement', async function(req,res){
    res.render('problemstatement');
});


//Create users at signup page
app.post("/signup", async (req, res) => {
    const { username, password, emailAddress} = req.body;
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);
    
    await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword,
            emailAddress: emailAddress,
        },
      });
      console.log('User created successfully');
      res.status(201).json({message: 'Signup successful'});
    }
    catch (err) {
        console.error("Error during signup:",err);
    res.status(500).send({message:"Internal Server Error"});
    }
});

//Login to account
app.post("/", async (req,res) => {
    const {username, password} = req.body;
    console.log('Login attempt for username:', username);

    try {
    const user = await prisma.user.findFirst( {       
        where: {
            username: username,
        },
    });

    if (!user) {
        console.warn("Login failed: User not found");
            return res.status(401).json({ message: "Login failed: User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) { 
    console.log("Login successful for", username);
    return res.status(200).send({ message: 'Login successful' }); // This line returns JSON response indicating success
    }
    else {
    console.warn("Login failed: Invalid password");
    return res.status(401).send({message: "Login failed"});
    }
}
        catch (err) {
        console.error("Error during Login:",err);
        return res.status(500).send({message:"Internal Server Error"});
    }
});
