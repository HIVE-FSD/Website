const express = require('express');
const Buzz = require("../models/Buzz");
const { createBuzz, editBuzz } = require('../Controllers/buzzController.js');
const { body, validationResult } = require('express-validator');
const validateBuzz = require('../Middleware/buzzValidator.js');

const app = express();
app.use(express.json());

app.set("views", "ejs");

app.post("/createBuzz",[
    body('buzz').notEmpty().withMessage('Buzz content is required'),
    body('title').notEmpty().withMessage('Title is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], createBuzz);
app.post("/editBuzz/:id", [
    body('buzz').notEmpty().withMessage('Buzz content is required'),
    body('title').notEmpty().withMessage('Title is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
], editBuzz)

module.exports = app;