const express = require('express');
const path = require('path');
const router = express.Router();
const User = require("../models/User");
const { upload } = require('../Middleware/mutler.js');
const BuzzSpace = require('../models/BuzzSpace.js');
const { createBuzzSpace, editBuzzSpace, joinBuzzSpace, leaveBuzzSpace, requestPromotion, approve, clearNotification } = require('../Controllers/BuzzSpaceController.js');
const { checkAuth } = require('../Middleware/mainware.js');
const { getBuzzsWithComments } = require('../Controllers/buzzController.js');
const Buzz = require('../models/Buzz.js');
const { body } = require('express-validator');
const { authUserBuzzSpace } = require('../Middleware/authoriser.js');

router.use(express.static(path.join(__dirname, '../public')));

router.post('/createBuzzSpace', upload, async (req, res) => {
    try {
        const { buzzSpaceName, buzzSpaceTag, description, creator } = req.body;
        const rules = JSON.parse(req.body.rules);
        
        const coverImage = req.files['cover'] ? req.files['cover'][0].filename : null;
        const logoImage = req.files['logo'] ? req.files['logo'][0].filename : null;

        // Create new buzzspace object
        const buzzSpace = await createBuzzSpace(buzzSpaceName, buzzSpaceTag, description, coverImage, logoImage, creator, rules);
        await User.findByIdAndUpdate(creator, { $push: { buzzSpace_ids: buzzSpace._id }, $inc: { 'info.buzzSpace_count': 1 } });

        const redirectRoute = `/buzzspace/${buzzSpace.name}`;

        res.status(201).json({ redirect: redirectRoute });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/all', async (req, res) => {
    try {
        const buzzspaces = await BuzzSpace.find({}, 'id name logo category numberOfMembersJoined');
        res.json(buzzspaces);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.get('/:name', checkAuth, async (req, res) => {

    try {
        const buzzSpace = await BuzzSpace.findOne({ name: req.params.name });
        const user = req.user;
        const creator = await User.findById(buzzSpace.creator)
        const joined = user.joined_buzzSpace_ids.includes(buzzSpace._id);
        const buzzes = await Buzz.find({ buzzSpace: buzzSpace._id }, '_id');
        const buzzIds = buzzes.map(buzz => buzz._id);
        const Formattedbuzzes = await getBuzzsWithComments(buzzIds, req.user._id);

        res.render('buzzSpace', { title: `Hive | ${buzzSpace.name}`, buzzes: Formattedbuzzes, buzzSpace, creator, user, joined});
    }   catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/joinBuzzSpace', joinBuzzSpace);
router.post('/leaveBuzzSpace', leaveBuzzSpace);
router.post('/editBuzzSpace', authUserBuzzSpace, editBuzzSpace);
router.post('/requestPromotion', requestPromotion);
router.post('/approve', approve);
router.post('/clearNotification', clearNotification);

module.exports = router;
