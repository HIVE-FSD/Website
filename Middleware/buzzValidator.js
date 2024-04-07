const { body, validationResult } = require('express-validator');

function validateBuzz(req, res, next) {
    return [
        body('buzz').notEmpty().withMessage('Buzz content is required'),
        body('title').notEmpty().withMessage('Title is required'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            console.log("Hello WOrld")
            next();
        }
    ];
}

module.exports = validateBuzz;
