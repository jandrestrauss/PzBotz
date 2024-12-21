const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateToken } = require('../utils/auth');

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/login' }),
    (req, res) => {
        const token = generateToken(req.user);
        res.cookie('auth_token', token, { httpOnly: true });
        res.redirect('/dashboard');
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('auth_token');
    res.redirect('/');
});

router.get('/status', (req, res) => {
    res.json({
        authenticated: req.isAuthenticated(),
        user: req.user
    });
});

module.exports = router;
