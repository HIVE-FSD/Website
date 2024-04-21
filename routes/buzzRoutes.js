const express = require('express');
const path = require('path');
const Buzz = require("../models/Buzz");
const User = require("../models/User");
const { createBuzz, editBuzz, deleteBuzz } = require('../Controllers/buzzController.js');
const { body, validationResult } = require('express-validator');
const { fetchBuzzSpaces } = require('../Controllers/ProfileController.js');
const { checkAuth } = require('../Middleware/mainware.js');
const Comment = require('../models/Comment.js');
const { authUserBuzz }  = require('../Middleware/authoriser.js')

const router = express.Router();

router.use(express.static(path.join(__dirname, '../public')));

const renderPage = async (route, file, props) => {
    router.get(route, checkAuth, async (req, res) => {
        try {
            const { joined_buzzSpace_ids } = req.user;

            const buzzSpaces = await fetchBuzzSpaces( joined_buzzSpace_ids );

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

router.delete("/deleteBuzz", authUserBuzz, deleteBuzz);

router.post("/editBuzz", [
    body('buzz').notEmpty().withMessage('Buzz content is required'),
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

        const newComment = new Comment({
            buzz: buzzId,
            comment,
            buzzer
        });

        const savedComment = await newComment.save();
        const buzz = await Buzz.findById(buzzId).populate('buzzer');
        const commentator = await User.findById(buzzer)
        if (buzz && buzz.buzzer) {
            const notificationMessage = `${commentator.info.display_name} commented on your buzz: "${buzz.title}""`;
            const notification = {
                type: 'comment',
                message: notificationMessage
            };
            if (buzz.buzzer && buzz.buzzer.notifications) { 
                buzz.buzzer.notifications.unshift(notification);
                await buzz.buzzer.save();
            } else {
                console.log(`Buzz creator's notifications array does not exist. "${buzzer.username}"`);
            }
        } else {
            console.log("Buzz or buzz creator not found.");
        }

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

        const newReply = new Comment({
            buzz: buzzId,
            parent: parent,
            comment,
            buzzer
        });

        const savedReply = await newReply.save();

        const parentComment = await Comment.findById(parent);

        if (!parentComment) {
            return res.status(404).json({ message: 'Parent comment not found' });
        }

        const Commenter = await User.findById(buzzer);
        const notificationMessage = `${Commenter.info.display_name} replied to your comment: "${parentComment.comment}"`;
        const notification = {
            type: 'reply',
            message: notificationMessage
        };

        const originalCommenter = await User.findById(parentComment.buzzer);
        if (originalCommenter && originalCommenter.notifications) {
            originalCommenter.notifications.unshift(notification);
            await originalCommenter.save();
        } else {
            console.log("Original commenter or notifications array not found.");
        }

        await Comment.findByIdAndUpdate(parent, { $push: { replies: { $each: [savedReply._id], $position: 0 } } });

        res.status(201).json(savedReply);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



router.post('/vote/:type/:action', async (req, res) => {
    const { type, action } = req.params;
    const { id, userId } = req.body;

    try {
        let targetModel;
        let targetField;

        // Determine whether it's a buzz or comment vote
        if (type === 'buzz') {
            targetModel = Buzz;
            targetField = action === 'upvote' ? 'upvotes' : 'downvotes';
        } else if (type === 'comment') {
            targetModel = Comment;
            targetField = action === 'upvote' ? 'upvotes' : 'downvotes';
        } else {
            return res.status(400).json({ message: 'Invalid vote type' });
        }

        // Find the target document by ID
        const target = await targetModel.findById(id);
        const previousUpvotes = target.upvotes.length;
        // Handle upvote/downvote actions
        if (action === 'upvote') {
            // Remove user ID from opposite vote array if present
            target.downvotes = target.downvotes.filter(uid => uid.toString() !== userId);

            // Add user ID to the upvotes array if not already present
            if (!target.upvotes.includes(userId)) {
                target.upvotes.push(userId);
            }
        } else if (action === 'downvote') {
            // Remove user ID from opposite vote array if present
            target.upvotes = target.upvotes.filter(uid => uid.toString() !== userId);

            // Add user ID to the downvotes array if not already present
            if (!target.downvotes.includes(userId)) {
                target.downvotes.push(userId);
            }
        } else if (action === 'removevote') {
            // Remove user ID from both upvotes and downvotes arrays if present
            target.upvotes = target.upvotes.filter(uid => uid.toString() !== userId);
            target.downvotes = target.downvotes.filter(uid => uid.toString() !== userId);
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        const currentUpvotes = target.upvotes.length;
        const upvotesIncrement = currentUpvotes - previousUpvotes;
        const totalUpvotes = currentUpvotes + upvotesIncrement;
        if (upvotesIncrement > 0 && totalUpvotes % 100 === 0) {
            const notificationMessage = `Congratulations! This ${type === 'buzz' ? 'Buzz' : 'Comment'} reached ${totalUpvotes} upvotes!`;
            const notification = {
                type: 'post', 
                message: notificationMessage
            };

            const user = await User.findById(userId);
            if (user) {
                user.notifications.unshift(notification);
                await user.save();
            } else {
                console.log("User not found.");
            }
        }

        // Save the updated document back to the database
        await target.save();
        res.json({ message: 'Vote updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;