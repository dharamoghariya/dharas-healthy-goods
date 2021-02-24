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
const mealModel = require("../models/itemList");
const express = require('express');
const router = express.Router();

// Set up a route to our homepage.
router.get("/", function(req,res) {
    res.render("general/home", {
        topItems: mealModel.getTopItems(),
        title: "Home"
    });
});

// Set up a rout to our welcome page. (setup another route to listen on /welcome)
router.get("/welcome", function(req, res){
    res.render("general/welcome", {
        title: "Welcome"
    });
});

// Set up a rout to our about page. (setup another route to listen on /about)
router.get("/about", function(req, res){
    res.render("general/about", {
        title: "About"
    });
});

// Set up a rout to our deal page. (setup another route to listen on /deal)
router.get("/deal", function(req, res){
    res.render("general/deal", {
        title: "Deal"
    });
});

// Set up a rout to our cart page. (setup another route to listen on /cart)
router.get("/cart", function(req, res){
    res.render("general/cart", {
        title: "Cart"
    });
});

// Set up a rout to our login page. (setup another route to listen on /login)
router.get("/login", function(req, res){
    res.render("general/login", {
        title: "Log In"
    });
});

// Log In Form Validation
router.post("/login", (req, res) => {
    console.log(req.body);

    let validationMessages = {};
    let passedValidation = true;

    const { email, password } = req.body;

    // Email validation
    if (email.length === 0) {
        validationMessages.email = "Email address required.";
        passedValidation = false;
    }

    // Password validation
    if (password.length === 0) {
        validationMessages.password = "Password required.";
        passedValidation = false;
    }

    // Email
    if (passedValidation) {
        res.send("Success");
    }
    else
    {
        res.render("general/login", {
            title: "Log In",
            validationMessages: validationMessages,
            values: req.body
        });
    }
});

// Set up a rout to our signup page. (setup another route to listen on /signup)
router.get("/signup", function(req, res){
    res.render("general/signup", {
        title: "Sign Up"
    });
});

// Sign Up Form Validation
router.post("/signup", (req, res) => {
    console.log(req.body);

    let validationMessages = {};
    let passedValidation = true;

    const { firstName, lastName, email, password } = req.body;

    // First name validation
    if (typeof firstName !== "string" || firstName.length === 0) {
        validationMessages.firstName = "You must specify a first name."
        passedValidation = false;
    }
    else if (firstName.length < 2) {
        validationMessages.firstName = "The first name must be at least 2 characters.";
        passedValidation = false;
    }

    // Last name validation
    if (typeof lastName !== "string" || lastName.length === 0) {
        validationMessages.lastName = "You must specify a last name."
        passedValidation = false;
    }
    else if (lastName.length < 2) {
        validationMessages.lastName = "The last name must be at least 2 characters.";
        passedValidation = false;
    }

    // Email validation
    // Regular Expression from https://stackoverflow.com/questions/940577/javascript-regular-expression-email-validation
    const formatEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    const validEmail = formatEmail.test(String(email).toLowerCase());
    if (email.length === 0) {
        validationMessages.email = "You must specify a email.";
        passedValidation = false;
    }
    else if (!validEmail) {
        validationMessages.email = "You must enter valid email.";
        passedValidation = false;
    }

    // Password validation
    if (password.length === 0) {
        validationMessages.password = "You must specify a password.";
        passedValidation = false;
    }
    else if (password.length < 6 || password.length > 12) {
        validationMessages.password = "Your password must be between 6 to 12 characters.";
        passedValidation = false;
    }
    else if (!(/[0-9]/.test(password))) {
        validationMessages.password = "Your password must contain at least one number.";
        passedValidation = false;
    }
    else if (!(/[!@#$%&*?"]/.test(password))) {
        validationMessages.password = "Your password must contain at least one Symbol.";
        passedValidation = false;
    }
    else if (password == password.toUpperCase()) {
        validationMessages.password = "Your password must contain at least one lower case character.";
        passedValidation = false;
    }
    else if (password == password.toLowerCase()) {
        validationMessages.password = "Your password must contain at least one Upper case characters.";
        passedValidation = false;
    }

    // If Validation Passed Then Send Email
    if (passedValidation) {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const emailMsg = {
            to: "dharamoghariya25@gmail.com",
            from: "dmoghariya@myseneca.ca",
            subject: "Sign Up Form Submission",
            html:
                `Vistor's Full Name: ${firstName} ${lastName}<br>
                Vistor's Email Address: ${email}<br>`
        };

        // Asyncronously sends the email message.
        sgMail.send(emailMsg)
            .then(() => {
                res.send("Success");
            })
            .catch(err => {
                console.log(`Error ${err}`);
                res.send("Error");
            });
    }
    else
    {
        res.render("general/signup", {
            title: "Sign Up",
            validationMessages: validationMessages,
            values: req.body
        });
    }
});

module.exports = router;