const express = require('express');
const Buzz = require("../models/Buzz");
const createBuzz = require('../Controllers/buzzController.js');
const validateBuzz = require('../Middleware/buzzValidator.js');

const app = express();
app.use(express.json());

app.set("views", "ejs");

app.post("/createBuzz", createBuzz);

module.exports = app;