/************************************************************************************
*  WEB322 – Assignment 1 (Winter 2021) 
*  I declare that this assignment is my own work in accordance with Seneca Academic 
*  Policy. No part of this assignment has been copied manually or electronically from 
*  any other source (including web sites) or distributed to other students.
*   
*  Name:  Dhara Moghariya
*  Student ID:  161449194
*  Course:  WEB322 NDD
*
************************************************************************************/ 

var items = [
    {
        title: "Sahi Paneer",
        include: "Paneer, Onion, Tomato, Nuts",
        description: "Sahi Paneer",
        category: "Vegetarian Meal",
        price: 11.99,
        cookingTime: "25 minutes",
        servings: 2,
        caloriesPerServing: 890,
        imageUrl: 'images/img06.jpg',
        topMeal: true
    },
    {
        title: "Organic Salad",
        include: "Tomato, Capsicum, Chickpea, Avocado",
        description: "Organic Salad",
        category: "Instant Meal",
        price: 12.99,
        cookingTime: "5 minutes",
        servings: 2,
        caloriesPerServing: 890,
        imageUrl: 'images/img01.jpg',
        topMeal: true
    },
    {
        title: "Sahi Rabdi",
        include: "Milk, Sugar, Nuts",
        description: "Sahi Rabdi",
        category: "Classic Meal",
        price: 9.99,
        cookingTime: "25 minutes",
        servings: 1,
        caloriesPerServing: 890,
        imageUrl: 'images/img19.jpg',
        topMeal: true
    },
    {
        title: "Green Cary",
        include: "Green Vegetables, Nuts, Rose, Tomato",
        description: "Green Cary",
        category: "Vegetarian Meal",
        price: 10.99,
        cookingTime: "25 minutes",
        servings: 2,
        caloriesPerServing: 890,
        imageUrl: 'images/img05.jpg',
        topMeal: false
    },
    {
        title: "Veg Manchurian",
        include: "Green Vegetable balls, Onion, Garlic",
        description: "Veg Manchurian",
        category: "Vegetarian Meal",
        price: 10.99,
        cookingTime: "25 minutes",
        servings: 2,
        caloriesPerServing: 890,
        imageUrl: 'images/img14.jpg',
        topMeal: true
    },
    {
        title: "Manchurian",
        include: "Meat balls, Onion, Garlic",
        description: "Manchurian",
        category: "Classic Meal",
        price: 10.99,
        cookingTime: "25 minutes",
        servings: 2,
        caloriesPerServing: 890,
        imageUrl: 'images/img14.jpg',
        topMeal: false
    },
    {
        title: "Pine Sweet",
        include: "Blue berry, Nuts, Cream, Crunch",
        description: "Pine Sweet",
        category: "Classic Meal",
        price: 10.99,
        cookingTime: "25 minutes",
        servings: 2,
        caloriesPerServing: 890,
        imageUrl: 'images/img15.jpg',
        topMeal: false
    },
    {
        title: "Classic Sizzler",
        include: "Meat, Vegetable, Cream, Nuts, Green veg mix, Tomato",
        description: "Classic Sizzler",
        category: "Classic Meal",
        price: 10.99,
        cookingTime: "25 minutes",
        servings: 2,
        caloriesPerServing: 890,
        imageUrl: 'images/img11.jpg',
        topMeal: false
    },
    {
        title: "Instant Salad",
        include: "All chopped Vegetable, Herbs, Spice mix",
        description: "Instant Salad",
        category: "Instant Meal",
        price: 10.99,
        cookingTime: "5 minutes",
        servings: 2,
        caloriesPerServing: 890,
        imageUrl: 'images/img18.jpg',
        topMeal: false
    }

];

module.exports.getAllItems = function() {
    return items;
};

module.exports.getTopItems = function() {
    var topItems = [];

    for (var i = 0; i < items.length; i++) {
        if (items[i].topMeal) {
            topItems.push(items[i]);
        }
    }
    return topItems;
};
