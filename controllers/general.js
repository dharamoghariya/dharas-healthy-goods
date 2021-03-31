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

// Set up a rout to our Clerk page. (setup another route to listen on /clerk)
router.get("/clerk", function(req, res){
    res.render("general/clerk", {
        title: "Clerk"
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

module.exports = router;