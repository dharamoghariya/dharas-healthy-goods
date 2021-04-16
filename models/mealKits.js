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