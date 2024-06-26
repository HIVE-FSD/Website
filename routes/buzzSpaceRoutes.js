const express = require('express');
const path = require('path');
const router = express.Router();
const User = require("../models/User");
const { upload } = require('../Middleware/mutler.js');
const BuzzSpace = require('../models/BuzzSpace.js');
const { createBuzzSpace, editBuzzSpace, joinBuzzSpace, leaveBuzzSpace, requestPromotion, approve, clearNotification, demoteModerator, getJoinedUsers } = require('../Controllers/BuzzSpaceController.js');
const { checkAuth } = require('../Middleware/mainware.js');
const { getBuzzsWithComments } = require('../Controllers/buzzController.js');
const Buzz = require('../models/Buzz.js');
const { body } = require('express-validator');
const { authUserBuzzSpace } = require('../Middleware/authoriser.js');

router.use(express.static(path.join(__dirname, '../public')));

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

router.post('/createBuzzSpace', upload, async (req, res) => {
    try {
        const { buzzSpaceName, buzzSpaceTag, description, creator } = req.body;
        const rules = JSON.parse(req.body.rules);

        const coverImage = req.files['cover'] ? req.files['cover'][0].filename : null;
        const logoImage = req.files['logo'] ? req.files['logo'][0].filename : null;

        if (!categories.includes(buzzSpaceTag)) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        // Create new buzzspace object
        const buzzSpace = await createBuzzSpace(buzzSpaceName, buzzSpaceTag, description, coverImage, logoImage, creator, rules);

        await User.findByIdAndUpdate(creator, {
            $push: {
                buzzSpace_ids: buzzSpace._id,
                joined_buzzSpace_ids: buzzSpace._id
            },
            $inc: { 'info.buzzSpace_count': 1 }
        });

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
        const buzzSpace = await BuzzSpace.findOne({ name: req.params.name }).populate('moderators');
        if (!buzzSpace) {
            return res.status(404).render('404.ejs', { title: '404 | No such buzzSpace!', layout: './layouts/authLayout', message: `The buzzSpace ${req.params.name} doesn't exist` });
        }
        const user = req.user;
        const creator = await User.findById(buzzSpace.creator)
        const joined = user.joined_buzzSpace_ids.includes(buzzSpace._id);
        const buzzes = await Buzz.find({ buzzSpace: buzzSpace._id }, '_id');
        const buzzIds = buzzes.map(buzz => buzz._id);
        const Formattedbuzzes = await getBuzzsWithComments(buzzIds, req.user._id);
        const isMod = buzzSpace.moderators.some(mod => mod._id.equals(user._id));
        const members = await getJoinedUsers(buzzSpace._id)

        res.render('buzzSpace', { title: `Hive | ${buzzSpace.name}`, buzzes: Formattedbuzzes, buzzSpace, creator, user, joined, isMod, members });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/joinBuzzSpace', joinBuzzSpace);
router.post('/leaveBuzzSpace', leaveBuzzSpace);
router.post('/editBuzzSpace', authUserBuzzSpace, editBuzzSpace);
router.post('/requestPromotion', requestPromotion);
router.post('/approve', approve);
router.post('/demoteModerator', demoteModerator);
router.post('/clearNotification', clearNotification);

module.exports = router;
