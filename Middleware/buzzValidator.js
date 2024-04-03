const { body, validationResult } = require('express-validator');

function validateBuzz(req, res, next){
    body('buzzSpaceName').notEmpty().withMessage('Buzz space name is required'),
    body('buzz').notEmpty().withMessage('Buzz content is required'),
    body('title').notEmpty().withMessage('Title is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
}

module.exports = validateBuzz;