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