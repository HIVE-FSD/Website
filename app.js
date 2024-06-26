const connectToMongo = require("./db");
require('dotenv').config();
const express = require("express")
const expressEjsLayouts = require("express-ejs-layouts")
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const mainRoutes = require('./routes/mainRoutes');
const buzzSpaceRoutes = require('./routes/buzzSpaceRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const buzzRoutes = require('./routes/buzzRoutes');
const session = require('express-session');
const app = express()
const port = process.env.PORT

app.use(session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false
}));

//Static files
app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/assets', express.static(__dirname + '/public/assets'))
app.use('/uploads', express.static(__dirname + '/public/uploads'))

app.use(expressEjsLayouts)
app.set('layout', './layouts/mainLayout')
app.set("view engine", 'ejs')
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Add buzzSpaceRoutes to your app

// Routes
app.use(mainRoutes);
app.use(authRoutes);
app.use(profileRoutes);
app.use('/buzz', buzzRoutes)
app.use('/buzzspace', buzzSpaceRoutes);
app.use('/category', categoryRoutes );


app.listen(port, () => console.log(`Server running on http://localhost:${port}`));