const express = require("express")
const expressEjsLayouts = require("express-ejs-layouts")
const authRoutes = require('./routes/authRoutes');
const session = require('express-session');
const User = require("./models/User");
const app = express()
const port = 3000


app.use(session({
    secret: 'Ballaya',
    resave: false,
    saveUninitialized: false
}));

//Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/assets', express.static(__dirname + 'public/assets'))

app.use(expressEjsLayouts)
app.set('layout', './layouts/mainLayout')
app.set("view engine", 'ejs')
app.use(express.urlencoded({
    extended: true
}));

app.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const username = req.session.user.username;

    try {
        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('index', {
            title: 'Home',
            user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About"
    })
})


// Routes
app.use(authRoutes);

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));