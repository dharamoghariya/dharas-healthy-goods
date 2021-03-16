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

const dotenv = require('dotenv');
dotenv.config({path:"./config/all.env"});

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

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Setup a folder that static resources can load from.
// Include images, css files, etc.
app.use(express.static(__dirname + "/static"));

// Load controllers into Express
const generalController = require("./controllers/general");
const mealController = require("./controllers/mealkit");


app.use("/", generalController);
app.use("/menu", mealController);

// Set up a route to a header page (http://localhost:8080/headers)
app.get("/headers", (req, res) => {
    const headers = req.headers;
    res.send(headers);
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


