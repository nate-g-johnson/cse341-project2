const express = require('express');
const passport = require('passport');
const router = express.Router();

// @route   GET /auth/github
// @desc    Redirect to GitHub for authentication
// @access  Public
router.get('/github', (req, res, next) => {
    console.log('→ Starting GitHub OAuth flow');
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

// @route   GET /auth/github/callback
// @desc    GitHub callback URL
// @access  Public
router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/auth/login-failed' }),
    (req, res) => {
        console.log('→ OAuth callback received');
        console.log('  User:', req.user ? req.user.username : 'none');
        console.log('  Session ID:', req.sessionID);
        console.log('  Is authenticated:', req.isAuthenticated());
        
        // Force session save
        req.session.save((err) => {
            if (err) {
                console.error('x Session save error:', err);
                return res.status(500).json({ message: 'Session save failed', error: err.message });
            }
            console.log(' Session saved successfully');
            console.log('  Redirecting to /auth/status');
            res.redirect('/auth/status');
        });
    }
);

// @route   GET /auth/logout
// @desc    Logout user
// @access  Public
router.get('/logout', (req, res) => {
    console.log('→ Logout requested');
    req.logout((err) => {
        if (err) {
            console.error('x Logout error:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('x Session destroy error:', err);
            }
            console.log(' Logged out successfully');
            res.json({ message: 'Logged out successfully' });
        });
    });
});

// @route   GET /auth/login-failed
// @desc    Login failure page
// @access  Public
router.get('/login-failed', (req, res) => {
    console.log('x Login failed');
    res.status(401).json({ message: 'Login failed. Please try again.' });
});

// @route   GET /auth/status
// @desc    Check authentication status
// @access  Public
router.get('/status', (req, res) => {
    console.log('→ Auth status check');
    console.log('  Session ID:', req.sessionID);
    console.log('  Has session:', !!req.session);
    console.log('  Is authenticated:', req.isAuthenticated());
    console.log('  User:', req.user ? req.user.username : 'none');
    
    if (req.isAuthenticated()) {
        res.json({ 
            authenticated: true, 
            user: {
                username: req.user.username,
                displayName: req.user.displayName
            },
            sessionID: req.sessionID
        });
    } else {
        res.json({ 
            authenticated: false,
            sessionID: req.sessionID,
            hasSession: !!req.session
        });
    }
});

module.exports = router;