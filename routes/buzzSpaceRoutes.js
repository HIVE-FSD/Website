const express = require('express');
const path = require('path');
const router = express.Router();
const User = require("../models/User");
const { upload } = require('../Middleware/mutler.js');
const BuzzSpace = require('../models/BuzzSpace.js');
const { createBuzzSpace, editBuzzSpace, joinBuzzSpace } = require('../Controllers/BuzzSpaceController.js');
const { checkAuth } = require('../Middleware/mainware.js');
const { getBuzzsWithComments } = require('../Controllers/buzzController.js');
const Buzz = require('../models/Buzz.js');

router.use(express.static(path.join(__dirname, '../public')));

router.post('/createBuzzSpace', upload, async (req, res) => {
    try {
        const { buzzSpaceName, buzzSpaceTag, description, creator } = req.body;
        const coverImage = req.files['cover'] ? req.files['cover'][0].filename : null;
        const logoImage = req.files['logo'] ? req.files['logo'][0].filename : null;

        // Create new buzzspace object
        const buzzSpace = await createBuzzSpace(buzzSpaceName, buzzSpaceTag, description, coverImage, logoImage, creator);
        await User.findByIdAndUpdate(creator, { $push: { buzzSpace_ids: buzzSpace._id } , $inc: { 'info.buzzSpace_count': 1 }});

        const redirectRoute = `/buzzspace/${buzzSpace.name}`;

        res.status(201).json({ redirect: redirectRoute });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




router.get('/:name', checkAuth, async (req, res) => {

    try {
        const buzzSpace = await BuzzSpace.findOne({ name: req.params.name });
        const buzzes = await Buzz.find({ buzzSpace: buzzSpace._id }, '_id');
        const buzzIds = buzzes.map(buzz => buzz._id);
        const Formattedbuzzes = await getBuzzsWithComments(buzzIds, req.user._id);

        res.render('buzzSpace', { title: `Hive | ${buzzSpace.name}`, buzzes : Formattedbuzzes, buzzSpace, user: req.user, });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/joinBuzzSpace', joinBuzzSpace);

module.exports = router;
