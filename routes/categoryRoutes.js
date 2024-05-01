const express = require('express');
const path = require('path');
const BuzzSpace = require('../models/BuzzSpace');
const { checkAuth } = require('../Middleware/mainware');
const { title } = require('process');
const router = express.Router();

router.use(express.static(path.join(__dirname, '../public')));


router.get('/', checkAuth, async (req, res) => {
    const user = req.user
    res.render('categories', { title: 'HIVE | Categories', user });
})


// Define the middleware to check if the category exists
const checkCategoryExists = (req, res, next) => {
    const categories = [
        "animals",
        "architecture",
        "art",
        "beauty",
        "books",
        "business",
        "cars",
        "celebrities",
        "cooking",
        "crafts",
        "culture",
        "design",
        "diy",
        "education",
        "entertainment",
        "environment",
        "events",
        "fashion",
        "finance",
        "fitness",
        "food",
        "games",
        "gardening",
        "health",
        "history",
        "hobbies",
        "movies",
        "music",
        "nature",
        "news",
        "pets",
        "photography",
        "politics",
        "science",
        "space",
        "spirituality",
        "sports",
        "technology",
        "travel",
        "weather"
    ];
    const category = req.params.category;
    if (categories.includes(category.toLowerCase())) {
        next();
    } else {
        res.status(404).render('404.ejs', { title: '404 | No such category!', layout: './layouts/authLayout', message: `The category ${category} doesn't exist` });
    }
};

// Implement the route with the middleware
router.get('/:category', checkAuth, checkCategoryExists, async (req, res) => {
    const user = req.user;
    const category = req.params.category; 
    let buzzSpaces = await BuzzSpace.find({ category: category }); 
    buzzSpaces = buzzSpaces.sort((a, b) => b.numberOfMembersJoined - a.numberOfMembersJoined);
    res.render('category', { title: `HIVE | Top ${category} BuzzSpaces`, user, buzzSpaces, category });
});


module.exports = router;