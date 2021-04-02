const express = require('express');
const bcrypt = require("bcryptjs");
const path = require("path");
const userModel = require('../models/user');
const router = express.Router();

// Set up signup page
router.get("/signup", (req, res) => {
    res.render("general/signup", {
        title: "Sign Up"
    });
});

// Sign Up Form Validation
router.post("/signup", (req, res) => {
    //console.log(req.body);

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
    // Regular Expression from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
    let pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
    if (password.length === 0) {
        validationMessages.password = "You must specify a password.";
        passedValidation = false;
    }
    else if (!(pwdRegex.test(password))) {
        validationMessages.password = "Your password must be between 6 to 12 characters and must contain at least one number, one special character, one lower and one upper case character.";
        passedValidation = false;
    }

    // If Validation Passed Then Send Email
    if (passedValidation) {
        let errors = [];

        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const user = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
    
        user.save()
        .then((userSaved) => {
            // User was saved correctly.
            console.log(`User ${userSaved.firstName} has been saved to the database.`); 

            const emailMsg = {
                to: `${email}`,
                from: "dmoghariya@myseneca.ca",
                subject: "Sign Up Form Submission",
                html:
                    `Vistor's Full Name: ${firstName} ${lastName}<br>
                    Vistor's Email Address: ${email}<br>
                    You sign up for Dhara's Healthy Goods`
            };
    
            // Asyncronously sends the email message.
            sgMail.send(emailMsg)
                .then(() => {
                    res.redirect("/welcome");
                })
                .catch(err => {
                    console.log(`Error ${err}`);
                    res.send("Error");
                    res.redirect("/signup");
                });
        })
        .catch((err) => {
            errors.push(`Error registering user because this email is already used.`);
            //console.log(`Error adding user to the database.  ${err}`);
            res.render("general/signup", {
                errors
            });
        });
        // res.redirect("/signup"); 
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

// Set up login page
router.get("/login", (req, res) => {
    res.render("general/login", {
        title: "Log In"
    });
});

router.post("/login", (req, res) => {

    // console.log(req.body);

    let validationMessages = {};
    let passedValidation = true;

    const { email, password, isClerk } = req.body;

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

        let errors = [];

        // Search MongoDB for a document with the matching email address.
        userModel.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (user) {
                // User was found, compare the password in the database
                // with the password submitted by the user.
                bcrypt.compare(req.body.password, user.password)
                .then((isMatched) => {
                    if (isMatched) {
                        // Password is matched.

                        // Create a new session and set the user to the
                        // "user" object returned from the DB
                        data = {};
                        data.firstName = user.firstName;
                        data.lastName = user.lastName;
                        data.email = user.email;
                        data.isClerk = req.body.isClerk;
                        req.session.user = data;

                        res.redirect("/");
                        
                    }
                    else {
                        // Password does not match.
                        errors.push("Sorry, your password does not match our database.")

                        res.render("general/login", {
                            errors
                        });
                    }
                })
                .catch((err) => {
                    // bcrypt failed for some reason.
                    console.log(`Error comparing passwords: ${err},`);
                    errors.push("Oops, something went wrong.");
            
                    res.render("general/login", {
                        errors
                    });
                });
            }
            else {
                // User was not found in the database.
                errors.push("Sorry, your email was not found.")

                res.render("general/login", {
                    errors
                });
            }
        })
        .catch((err) => {
            // Couldn't query the database.
            console.log(`Error finding the user from the database: ${err},`);
            errors.push("Oops, something went wrong.");

            res.render("general/login", {
                errors
            });
        });
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

// Set up logout page
router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();
    
    res.redirect("/login");
});


module.exports = router;
