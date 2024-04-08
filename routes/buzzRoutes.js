const express = require('express');
const path = require('path');
const Buzz = require("../models/Buzz");
const { createBuzz, editBuzz } = require('../Controllers/buzzController.js');
const { body, validationResult } = require('express-validator');
const { fetchBuzzSpaces } = require('../Controllers/ProfileController.js');
const { checkAuth } = require('../Middleware/mainware.js');
const Comment = require('../models/Comment.js');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../public')));

const renderPage = async (route, file, props) => {
    router.get(route, checkAuth, async (req, res) => {
        try {
            const { buzzSpace_ids } = req.user;

            const buzzSpaces = await fetchBuzzSpaces(buzzSpace_ids);

            res.render(file, { ...props, user: req.user, buzzSpaces });
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error response
            res.status(500).send('Server Error');
        }
    });
};

renderPage('/newbuzz', 'newbuzz', {
    title: 'HIVE | New Buzz'
})

router.post("/createBuzz",[
    body('buzz').notEmpty().withMessage('Buzz content is required'),
    body('title').notEmpty().withMessage('Title is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], createBuzz);

router.post("/editBuzz/:id", [
    body('buzz').notEmpty().withMessage('Buzz content is required'),
    body('title').notEmpty().withMessage('Title is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], editBuzz)

router.post('/newcomment', async (req, res) => {
    try {
        const { buzzId, comment, buzzer } = req.body;

        // Create a new comment object
        const newComment = new Comment({
            buzz: buzzId,
            comment,
            buzzer
        });

        const savedComment = await newComment.save();
        
        await Buzz.findByIdAndUpdate(buzzId, { $push: { comments: { $each: [savedComment._id], $position: 0 } } });

        res.status(201).json(savedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/newreply', async (req, res) => {
    try {
        const { buzzId, parent, comment, buzzer } = req.body;

        // Create a new comment object
        const newComment = new Comment({
            buzz: buzzId,
            comment,
            buzzer
        });

        const savedComment = await newComment.save();
        const updatedParent = await Comment.findByIdAndUpdate(parent, { $push: { replies: { $each: [savedComment._id], $position: 0 } } });

        if (!updatedParent) {
            return res.status(404).json({ message: 'Parent comment not found' });
        }

        res.status(201).json(savedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get('/comments/:id', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;