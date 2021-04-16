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

// const mealModel = require("../models/itemList");
const MealkitModel = require("../models/mealKits");
const express = require('express');
const router = express.Router();

router.get("/", function(req, res) {
    MealkitModel.find()
    .exec()
    .then((allMealkits) => {
        let data = allMealkits.map(value => value.toObject());
        let categories = []
        for (i = 0; i < data.length; i++) {
            let currentItems = data[i];
            let categoryName = currentItems.category
            
            let category = categories.find(c=>c.category == categoryName);

            if (!category) {
                category = {
                    category: categoryName,
                    categoryItems: []
                };
                categories.push(category);
            }
            category.categoryItems.push(currentItems);
        }
        res.render("general/menu", {
            menuItems: categories,
            title: "Menu"
        });
    });
});

module.exports = router;