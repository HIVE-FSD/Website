const User = require("../models/User");

const checkAuth = async (req, res, next) => {
    if (!req.session.userID) {
        return res.redirect('/login');
    }

    const userID = req.session.userID;

    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).send('User not found');
        }

        req.user = user;
        next(); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    checkAuth
};
