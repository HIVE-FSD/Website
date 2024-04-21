const express = require('express');
const { checkAuth } = require('../Middleware/mainware');
const { getBuzzsWithComments, fetchRecentPosts } = require('../Controllers/buzzController');
const { fetchBuzzSpaces } = require('../Controllers/ProfileController');


const app = express.Router();

const renderPage = (route, file, props) => {
    app.get(route, checkAuth, (req, res) => {
        res.render(file, { ...props, user: req.user });
    });
};

app.get('/', checkAuth, async (req, res) => {
    const user = req.user
    const buzzes = await getBuzzsWithComments( await fetchRecentPosts(user.joined_buzzSpace_ids), user._id)
    const joinedSpaces = await fetchBuzzSpaces(user.joined_buzzSpace_ids)
    res.render('index', { title: 'HIVE | Home', user, buzzes, joinedSpaces });
})

renderPage('/newbuzzspace', 'newbuzzSpace', {
    title: 'HIVE | New BuzzSpace'
})

renderPage('/faqs', 'faqs', {
    title: 'HIVE | FAQs'
})

renderPage('/notifications', 'notifications', {
    title: 'HIVE | My Notifications'
})

renderPage('/topbuzzspaces', 'topBuzzSpaces', {
    title: 'HIVE | Top BuzzSpaces'
})



module.exports = app;