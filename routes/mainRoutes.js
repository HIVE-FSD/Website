const express = require('express');
const { checkAuth } = require('../Middleware/mainware');
const { getBuzzsWithComments, fetchRecentPosts } = require('../Controllers/buzzController');
const { fetchBuzzSpaces } = require('../Controllers/ProfileController');
const path = require('path');
const BuzzSpace = require('../models/BuzzSpace');


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


app.get('/topbuzzspaces', checkAuth, async (req, res) => {
    const user = req.user
    let buzzSpaces = await BuzzSpace.find()
    buzzSpaces = buzzSpaces.sort((a, b) => b.numberOfMembersJoined - a.numberOfMembersJoined)
    res.render('topBuzzSpaces', { title: 'HIVE | Top BuzzSpaces', user, buzzSpaces});
})


module.exports = app;