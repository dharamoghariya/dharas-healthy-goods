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

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Define the meal schema
const mealkitSchema = new mongoose.Schema({
    title: 
    {
        type: String,
        required: true,
        unique: true
    },
    include: 
    {
        type: String,
        required: false
    },
    description:
    {
        type: String,
        required: false
    },
    category:
    {
        type: String,
        required: false
    },
    price:
    {
        type: Number,
        required: false
    },
    cookingTime:
    {
        type: String,
        required: false
    },
    servings:
    {
        type: Number,
        required: false
    },
    caloriesPerServing:
    {
        type: Number,
        required: false
    },
    imageUrl:
    {
        type: String,
        required: false
    },
    topMeal:
    {
        type: Boolean,
        required: false,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

const mealkitModel = mongoose.model("Mealkits", mealkitSchema);
module.exports = mealkitModel;
