const mealkitModel = require("../models/mealKits");
const express = require('express');
const router = express.Router();
const path = require("path");


// Prepare the view model
const prepareViewModel = function(req, message) {
    
    if (req.session && req.session.user) {
        var cart = req.session.cart || [];
        var cartTotal = 0;

        // Check if meal have been added to the shopping cart.
        const hasMeals = Array.isArray(cart) && cart.length > 0;

        // There are meal in the shopping cart, calculate the order total.
        if (hasMeals) {
            cart.forEach(cartMeal => {
                cartTotal += (cartMeal.meal.price * cartMeal.qty);
            });
        }

        // Return the view model
        return {
            hasMeals: hasMeals,
            meals: req.session.cart,
            cartTotal: "$" + cartTotal.toFixed(2),
            message: message
        };
    }
    else {
        // There is no session yet, so return an empty view model.
        return {
            hasMeals: false,
            meals: [],
            cartTotal: "$0.00",
            message: message
        };
    }
};

// Default route (http://localhost/)
router.get("/cart", (req, res) => {
    res.render("general/cart", prepareViewModel(req));
});


// Route to add a new meal. The ID of the meal is specified in the URL. (http://localhost/add-meal/id)
router.get("/add-meal/:id", (req, res) => {
    const mealId = req.params.id;

    if (!req.session.user) {
        // Cannot add the meal because the user is not logged in.
        res.render("general/msg", prepareViewModel(req, "You must be logged in."));
    }
    else {
        var cart = req.session.cart = req.session.cart || [];
        var message;

        mealkitModel.findOne({_id:mealId})
        .exec()
        .then((meal) => {
            var found = false;
            cart.forEach(cartMeal => {
                if (cartMeal.id == meal.id) {
                    cartMeal.qty++;
                    found = true;
                }
            });

            if (found) {
                message = "Meal was already in the cart, incremented the quantity by one.";
            }
            else {
                cart.push({
                    id: mealId,
                    qty: 1,
                    meal: meal.toObject()
                });
                cart.sort((a, b) => a.meal.title.localeCompare(b.meal.title));
                message = "Meal added to the shopping cart.";
            }
            // Render the view using the view model. res.render("general/menu", prepareViewModel(req, message));
            res.redirect("/menu");
        }).catch(error =>{
            message = "No meals found";
            res.render("general/msg", prepareViewModel(req, message));
        });
    }
});


// Route to remove a meal. The ID of the meal is specified in the URL. (http://localhost/remove-meal/id)
router.get("/remove-meal/:id", (req, res) => {
    const mealId = req.params.id;

    if (!req.session.user) {
        // Cannot remove the meal because the user is not logged in.
        res.render("general/msg", prepareViewModel(req, "You must be logged in."));
    }
    else {
        var cart = req.session.cart || [];
        var message;

        // Find the meal in the shopping cart.
        const index = cart.findIndex((cartMeal) => { return cartMeal.id == mealId });

        if (index >= 0) {
            // Meal was found, remove it from the shopping cart.
            message = `Removed ${cart[index].meal.title} from the cart.`;

            cart.splice(index, 1);
        }
        else {
            // Song was not found, there is nothing to remove.
            message = "Meal was not found in your cart.";
        }

        // Render the view using the view model.
        res.render("general/cart", prepareViewModel(req, message));
    }
});


// Check out the user/empty the cart. (http://localhost/check-out)
router.get("/check-out", (req, res) => {

    var message;

    if (!req.session.user) {
        // User is not logged in and therefore cannot checkout.
        message = "You must be logged in.";
    }
    else if (Array.isArray(req.session.cart) && req.session.cart.length > 0) {
        
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const emailCheckoutMsg = {
            to: `${req.session.user.email}`,
            from: "dmoghariya@myseneca.ca",
            subject: "Checkout from Dhara's Healthy Good",
            html:
                `Vistor's Full Name: ${req.session.user.firstName} ${req.session.user.lastName}<br>
                Vistor's Email Address: ${req.session.user.email}<br>
                You bought these items from Dhara's Healthy Goods
                ${req.session.cart}`
        };

        // Asyncronously sends the email message.
        sgMail.send(emailCheckoutMsg);

        message = "Thank you for your purchase, checked out!"
        req.session.cart = [];
    }
    else {
        // There are no items in the cart.
        message = "You cannot check-out, there are no items in the cart.";
    }

    // Render the view using the view model.
    res.render("general/cart", prepareViewModel(req, message));
});

module.exports = router;