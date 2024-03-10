// profileRoutes.js

const express = require('express');
const User = require('../models/User');
const router = express.Router();

// PUT route to update user's avatar index
router.put('/users/:userId/update-avatar', async (req, res) => {
    const userId = req.params.userId;
    const { avatarIndex } = req.body;
    try {
        // Find the user by ID and update the avatar_index field
        const user = await User.findByIdAndUpdate(userId, { 'info.avatar_index': avatarIndex }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'Avatar index updated successfully', user });
    } catch (error) {
        console.error('Error updating avatar index:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT route to update user's profile
router.put('/users/:userId/update-profile', async (req, res) => {
    const userId = req.params.userId;
    const { displayName, bio } = req.body;

    const updateFields = {}; 

    if (displayName && displayName.trim() !== '') {
        updateFields['info.display_name'] = displayName.trim();
    }

    // Check if bio is provided and not empty
    if (bio && bio.trim() !== '') {
        updateFields['info.bio'] = bio.trim();
    }

    try {
        // Find the user by ID and update the specified fields
        const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
