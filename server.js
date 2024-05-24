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
const { PrismaClient } = require('@prisma/client');
const { read, readSync } = require("fs");
const prisma = new PrismaClient();

// Tells the app which port to run on
app.listen(8000);

// Serve static files from the main directory
app.use(express.static(__dirname));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route to serve the main page
app.get('/', (req, res) => {
    res.render('index');
});

// Route to serve the index HTML page
app.get('/index', (req, res) => {
    res.render('index');
});

// Route to serve the signup HTML page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Route to serve the planner HTML page
app.get('/planner', (req, res) => {
    res.render('planner');
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
    //filter database
    const findUser = await prisma.coke.findMany({
        where: {
            name: 'Sprite',
        }
    });
    console.log(findUser); 
    res.render('problemstatement', { user: findUser });
});

//to automatically fetch data from db - coke
// const users = await prisma.coke.findMany();
// console.log(users); 


//Create users at signup page
app.post("/signup", async (req,res) => {
    const {username, password, emailAddress} = req.body

    await prisma.user.create({
        data: {
            username: username,
            password: password,
            emailAddress: emailAddress,
        },
      })
      res.redirect("/")
})

//Login to account
app.post("/index", async (req,res) => {
    const {username, password, emailAddress} = req.body
    const user = await prisma.user.findFirst( {       
        where: {
            username: username,
            password: password,
        }
    })
    if (user) { 
    res.redirect("/planner")
    }
    else
    res.status(401).send({message: "Login failed"})
})
