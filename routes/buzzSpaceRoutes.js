const express = require('express');
const path = require('path');
const router = express.Router();
const User = require("../models/User");
const { upload } = require('../Middleware/mutler.js');
const BuzzSpaceController = require('../Controllers/BuzzSpaceController.js');

router.use(express.static(path.join(__dirname, '../public')));

router.post('/createBuzzSpace', upload, async (req, res) => {
    try {
        const { buzzSpaceName, buzzSpaceTag, description, creator } = req.body;
        const coverImage = req.files['cover'] ? req.files['cover'][0].filename : null;
        const logoImage = req.files['logo'] ? req.files['logo'][0].filename : null;

        // Create new buzzspace object
        await BuzzSpaceController.createBuzzSpace(buzzSpaceName, buzzSpaceTag, description, coverImage, logoImage, creator);

        res.status(201).send('BuzzSpace created successfully.');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




router.get('/:name', async (req, res) => {
    if (!req.session.userID) {
        return res.redirect('/login');
    }

    const userID = req.session.userID;
    const buzzspaceName = req.params.name;

    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('buzzSpace', { title: buzzspaceName, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
