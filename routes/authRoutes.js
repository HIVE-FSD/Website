// authRoutes.js

const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../Controllers/User');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { title: 'Log in', layout: './layouts/authLayout', loginError: req.query.loginError, req: req });
});

router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign up', layout: './layouts/authLayout', signupSuccess: req.query.signupSuccess, req: req });
});
router.get('/verification', (req, res) => {
    res.render('verification', { title: 'Hive', layout: './layouts/authLayout', emailSent: req.query.emailSent, emailVerified: req.query.emailVerified, req: req });
});

router.post('/signup', [
    body('username').notEmpty().trim().escape().withMessage('Invalid username'),
    body('email').isEmail().notEmpty().trim().escape().withMessage('Invalid email'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        let errorMessage;
        if (errorMessages.includes('Invalid username')) {
            errorMessage = 'username';
        } else if (errorMessages.includes('Password must be at least 3 characters long')) {
            errorMessage = 'password';
        } else if (errorMessages.includes('Password confirmation does not match password')) {
            errorMessage = 'confirmPassword';
        }
        return res.redirect(`/signup?signupError=true&errorMessage=${errorMessage}`);
    }

    const { username, password, email } = req.body;
    
    try {
        // Check if username already exists
        const existingUser = await User.getUserByUsername(username);
        if (existingUser) {
            return res.redirect('/signup?signupError=true');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.createUser(username, hashedPassword, email);

        const verificationLink = `${process.env.SITE}:${process.env.PORT}/verify/${newUser.id}`;
        sendVerificationEmail(newUser.email, verificationLink);
        res.redirect('/verification?emailSent=true');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.getUserByUsername(username);
        if (!user) {
            return res.redirect('/login?loginError=true');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch || !(user.is_verified)) {
            return res.redirect('/login?loginError=true');
        } 
        req.session.userID = user._id;
        res.redirect('/');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Server Error');
        } else {
            res.redirect('/login');
        }
    });
});

router.get('/verify/:userId', (req, res) => {
    const userId = req.params.userId;
    User.verifyUser(userId);
    res.redirect('/verification?emailVerified=true');
});


function sendVerificationEmail(email, verificationLink) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.VERIFIERMAIL,
            pass: process.env.VERIFIERMAILPASS
        }
    });
    
    
    const mailOptions = {
        from: 'hive0024@email.com',
        to: email,
        subject: 'Email Verification',
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending verification email:', error);
        }
    });
}



module.exports = router;
