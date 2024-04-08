const express = require('express');
const { checkAuth } = require('../Middleware/mainware');


const app = express.Router();

const renderPage = (route, file, props) => {
    app.get(route, checkAuth, (req, res) => {
        res.render(file, { ...props, user: req.user });
    });
};

renderPage('/', 'index', {
    title: 'HIVE | Home'
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