const express = require('express');
const { checkAuth } = require('../Middleware/mainware');
const { getBuzzsWithComments, fetchRecentPosts } = require('../Controllers/buzzController');


const app = express.Router();

const renderPage = (route, file, props) => {
    app.get(route, checkAuth, (req, res) => {
        res.render(file, { ...props, user: req.user });
    });
};

app.get('/', checkAuth, async (req, res) => {
    const buzzes = await getBuzzsWithComments( await fetchRecentPosts())

    res.render('index', { title: 'HIVE | Home', user: req.user, buzzes });
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