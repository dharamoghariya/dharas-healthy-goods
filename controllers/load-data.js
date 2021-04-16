/************************************************************************************
*  WEB322 – Assignment 5 (Winter 2021) 
*  I declare that this assignment is my own work in accordance with Seneca Academic 
*  Policy. No part of this assignment has been copied manually or electronically from 
*  any other source (including web sites) or distributed to other students.
*   
*  Name:  Dhara Moghariya
*  Student ID:  161449194
*  Course:  WEB322 NDD
*
************************************************************************************/ 

const MealkitModel = require("../models/mealKits");
const express = require('express');
const router = express.Router();
const path = require("path");


function cleanData(data) {
    var price = parseFloat(data.price);
    var servings = parseInt(data.servings);
    var caloriesPerServing = parseInt(data.caloriesPerServing);

    if (isNaN(price)){
        price = undefined;
    }
    data.price = price;

    if (isNaN(servings)){
        servings = undefined;
    }
    data.servings = servings;

    if (isNaN(caloriesPerServing)){
        caloriesPerServing = undefined;
    }
    data.caloriesPerServing = caloriesPerServing;

    var topMeal = data.topMeal;
    if (topMeal == "true") {
        topMeal = true;
    }
    else {
        topMeal = false;
    }
    data.topMeal = topMeal;

    return data;
}

router.get("/meal-kits", function(req, res) {
    if (!req.session.user || !req.session.user.isClerk) {
        // Cannot add the access this page if you are not Data Clerk.
        let message = "You are not authorized to add meal kits";
        // res.redirect("/");
        res.render("general/msg", {
            message
        });
    }
    else {
        // Fetch all of the mealkits and order them by id
        MealkitModel.find()
        .exec()
        .then((data) => {
            // Pull the data (exclusively)
            // This is to ensure that our "data" object contains the returned data (only) and nothing else.
            data = data.map(value => value.toObject());

            res.render("general/meal-kits", {
                title: "Mealkits",
                data: data
            });
        });
    }
});

// Define the "/addMealkit" route
router.post("/addMealkit", (req, res) => {

    let data = cleanData(req.body);

    let message;

    let parsed = path.parse(req.files.imageUrl.name);
    let filename = `/images/${req.body.title}_${parsed.name}${parsed.ext}`;

    if (!['.png', '.jpg', '.jpeg', '.gif'].includes(parsed.ext)) {
        message = "Please upload right type of image";
        res.render("general/msg", {
            message
        });
    } else {

        var newMealkit = new MealkitModel({
            title: data.title,
            include: data.include,
            description: data.description,
            category: data.category,
            price: data.price,
            cookingTime: data.cookingTime,
            servings: data.servings,
            caloriesPerServing: data.caloriesPerServing,
            imageUrl: filename,
            topMeal: data.topMeal
        });

        newMealkit.save((err) => {
            if (err) {
                console.log("Couldn't create the new mealkit:" + err);
                message = "Meal kits have already been added to the database";
            }
            else {
                // Copy the image data to a file in the "static/images" folder.
                req.files.imageUrl.mv(`./static${filename}`);
                console.log("Successfully created a new mealkit: " + newMealkit.title);
                message = "Added meal kits to the database";
            }
            // res.redirect("/");
            res.render("general/msg", {
                message
            });
        });
    }
});

// Define the "/updateMealkit" route
router.post("/updateMealkit", (req, res) => {
    let data = cleanData(req.body);

    // Check to see if title field is blank
    if (data.title == 0) {
        // Remove a record from the  "name" model with the data from req.body
        MealkitModel.deleteOne({
            title: data.title
        })
        .exec()
        .then(() => {
            console.log("Successsfully removed user: " + data.title);
            res.redirect("meal-kits"); // Redirect back to the mealkit page
        })
    }
    else {
        if (req.files) {
            let parsed = path.parse(req.files.imageUrl.name);
            let filename = `/images/${req.body.title}_${parsed.name}${parsed.ext}`;

            if (!['.png', '.jpg', '.jpeg', '.gif'].includes(parsed.ext)) {
                message = "Please upload right type of image";
                res.render("general/msg", {
                    message
                });
            }
            else {
                data.imageUrl = filename;
            }
        }

        // Update a record using the "title" of mealkit model with the data from req.body
        if (data.imageUrl != undefined) {
            MealkitModel.updateOne({
                title: req.body.title
            }, {
                $set: {
                    include: data.include,
                    description: data.description,
                    category: data.category,
                    price: data.price,
                    cookingTime: data.cookingTime,
                    servings: data.servings,
                    caloriesPerServing: data.caloriesPerServing,
                    topMeal: data.topMeal,
                    imageUrl: data.imageUrl
                }
            })
            .exec()
            .then(() => {
                req.files.imageUrl.mv(`./static${filename}`);
                console.log("Successfully updated name: " + req.body.title);
                res.redirect("meal-kits"); // Redirect back to the mealkit page
            });
        } else {
            MealkitModel.updateOne({
                title: req.body.title
            }, {
                $set: {
                    include: data.include,
                    description: data.description,
                    category: data.category,
                    price: data.price,
                    cookingTime: data.cookingTime,
                    servings: data.servings,
                    caloriesPerServing: data.caloriesPerServing,
                    topMeal: data.topMeal
                }
            })
            .exec()
            .then(() => {
                console.log("Successfully updated name: " + req.body.title);
                res.redirect("meal-kits"); // Redirect back to the mealkit page
            });
        } 
    }
});

module.exports = router;