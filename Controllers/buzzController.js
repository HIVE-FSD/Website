const Buzz = require('../models/Buzz');

const createBuzz = async (req, res, next) => {
    try {
        const { buzzSpaceName, buzz, title } = req.body;
        const newBuzz = new Buzz({
            buzzSpaceName: buzzSpaceName,
            buzz: buzz,
            title: title
        });
        await newBuzz.save();
        res.status(201).send('Buzz created.');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

module.exports = createBuzz;
