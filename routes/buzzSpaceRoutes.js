const express = require('express');
const path = require('path');
const router = express.Router();
const User = require("../Controllers/User");

router.use(express.static(path.join(__dirname, '../public')));

router.get('/:name', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const username = req.session.user.username;
    const buzzspaceName = req.params.name;

    try {
        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // You can do something with the buzzspaceName here

        res.render('buzzSpace', { title: buzzspaceName, user }); // Render your buzzSpace template
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
