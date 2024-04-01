const connectToMongo = require("./db");
const express = require("express")
const expressEjsLayouts = require("express-ejs-layouts")
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
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
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/assets', express.static(__dirname + '/public/assets'))

app.use(expressEjsLayouts)
app.set('layout', './layouts/mainLayout')
app.set("view engine", 'ejs')
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

const renderPage = (route, file, props) =>{
    app.get(route, async (req, res) => {
        if (!req.session.userID) {
            return res.redirect('/login');
        }
        
        const userID = req.session.userID;
    
        try {
            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).send('User not found');
            }
    
            res.render(file, {...props, user});
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

}

renderPage('/', 'index', {
    title: 'HIVE | Home'
})

renderPage('/newbuzz', 'newbuzz', {
    title: 'HIVE | New Buzz'
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

renderPage('/profile', 'profile', {
    title: 'HIVE | My profile'
})

const buzzSpaceRoutes = require('./routes/buzzSpaceRoutes');

// Add buzzSpaceRoutes to your app
app.use('/buzzspace', buzzSpaceRoutes);


// Routes
app.use(authRoutes);
app.use(profileRoutes);


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));