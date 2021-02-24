const mealModel = require("../models/itemList");
const express = require('express');
const router = express.Router();

router.get("/", function(req, res) {
    res.render("general/menu", {
        items: mealModel.getAllItems(),
        title: "Menu"
    });
});

module.exports = router;