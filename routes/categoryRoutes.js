const express = require('express');
const path = require('path');
const BuzzSpace = require('../models/BuzzSpace');
const { checkAuth } = require('../Middleware/mainware');
const { title } = require('process');
const router = express.Router();

router.use(express.static(path.join(__dirname, '../public')));


// Define the middleware to check if the category exists
const checkCategoryExists = (req, res, next) => {
    const categories = [
        "Technology", "Fashion", "Travel", "Food", "Sports",
        "Music", "Movies", "Books", "Art", "Health",
        "Fitness", "Finance", "Business", "Education", "Science",
        "Nature", "Photography", "Animals", "Cars", "Games",
        "Design", "DIY", "Gardening", "Cooking", "Crafts",
        "Beauty", "Fitness", "History", "Space", "Architecture",
        "Spirituality", "Pets", "Hobbies", "Environment", "Politics",
        "News", "Weather", "Entertainment", "Celebrities", "Events",
        "Culture", "Education", "Technology", "Finance", "Business"
    ];
    const category = req.params.category;
    if (categories.includes(category)) {
        next();
    } else {
        res.status(404).render('404.ejs', { title: '404 | No such category!', layout: './layouts/authLayout', message : `The category ${category} doesn't exist` });
    }
};

// Implement the route with the middleware
router.get('/:category', checkAuth, checkCategoryExists, async (req, res) => {
    const user = req.user;
    const category = req.params.category; // Extracting the category from the URL
    let buzzSpaces = await BuzzSpace.find({ category: category }); // Assuming you have a 'category' field in your BuzzSpace model
    buzzSpaces = buzzSpaces.sort((a, b) => b.numberOfMembersJoined - a.numberOfMembersJoined);
    res.render('categories', { title: `HIVE | Top ${category} BuzzSpaces`, user, buzzSpaces, category });
});


router.get('/:category', checkAuth, async (req, res) => {
    const user = req.user;
    const category = req.params.category; // Extracting the category from the URL
    let buzzSpaces = await BuzzSpace.find({ category: category }); // Assuming you have a 'category' field in your BuzzSpace model
    buzzSpaces = buzzSpaces.sort((a, b) => b.numberOfMembersJoined - a.numberOfMembersJoined);
    res.render('categories', { title: `HIVE | Top ${category} BuzzSpaces`, user, buzzSpaces, category });
});

module.exports = router;