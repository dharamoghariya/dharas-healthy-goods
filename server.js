/************************************************************************************
*  WEB322 – Assignment 3 (Winter 2021) 
*  I declare that this assignment is my own work in accordance with Seneca Academic 
*  Policy. No part of this assignment has been copied manually or electronically from 
*  any other source (including web sites) or distributed to other students.
*   
*  Name:  Dhara Moghariya
*  Student ID:  161449194
*  Course:  WEB322 NDD
*
************************************************************************************/ 

const path = require("path");

const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload");

// Set up dotenv environment variables.
dotenv.config({path:"./config/all.env"});

// Set up express
const app = express();

// Set up Handlebars
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        repString: function(data, search, replace) {
            return data.replace(search, replace);
        }
    }
}));

app.set('view engine', '.hbs');

// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    // res.locals.user is a global handlebars variable.
    // This means that every single handlebars file can access that user variable
    res.locals.user = req.session.user;
    next();
});

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Set up express-fileupload
app.use(fileUpload());

// Setup a folder that static resources can load from.
// Include images, css files, etc.
app.use(express.static(__dirname + "/static"));

// Load controllers into Express
const generalController = require("./controllers/general");
const mealController = require("./controllers/mealkit");
const userController = require("./controllers/user");
const loadDataController = require("./controllers/load-data");
const cartController = require("./controllers/cart");

app.use("/", generalController);
app.use("/menu", mealController);
app.use("/", userController);
app.use("/load-data", loadDataController);
app.use("/", cartController);

// Set up a route to a header page (http://localhost:8080/headers)
app.get("/headers", (req, res) => {
    const headers = req.headers;
    res.send(headers);
});

// Set up and connect to MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => {
    console.log("Connected to the MongoDB database.");
})
.catch((err) => {
    console.log(`There was a problem connecting to MongoDB ... ${err}`)
});

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});  


// Start listening
const HTTP_PORT = process.env.PORT;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}   // http://localhost:8080
  
// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);


