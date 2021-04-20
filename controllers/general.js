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

// const mealModel = require("../models/itemList");
const TopMealModel = require("../models/mealKits");
const express = require('express');
const router = express.Router();

// Set up a route to our homepage.
router.get("/", function(req,res) {
    TopMealModel.find()
    .exec()
    .then((topMealkits) => {
        let data = topMealkits.map(value => value.toObject());
        var topMealItems = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].topMeal) {
                topMealItems.push(data[i]);
            }
        }
        res.render("general/home", {
            topItems: topMealItems,
            title: "Home"
        });
    });
});

// Set up a rout to our welcome page. (setup another route to listen on /welcome)
router.get("/welcome", function(req, res){
    res.render("general/welcome", {
        title: "Welcome"
    });
});

// Set up a rout to our description page. (setup another route to listen on /welcome)
router.get("/description/:id", function(req, res){
    const mealId = req.params.id;

    TopMealModel.findOne({_id:mealId})
    .exec()
    .then((meal) => {
        res.render("general/description", {
            title: `${meal.title}`,
            meal: meal.toObject()
        });
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

// Set up a rout to our Clerk Data Entry page if user is clerk else redirect to deal page. (setup another route to listen on /mealData)
// router.get("/meal-kits", function(req, res){
//     res.render("general/meal-kits", {
//         title: "Mealkits"
//     });
// });

// Set up a rout to our cart page. (setup another route to listen on /cart)
router.get("/cart", function(req, res){
    res.render("general/cart", {
        title: "Cart"
    });
});

module.exports = router;