const express = require('express');
const passport = require('passport');
const router = express.Router();

// @route   GET /auth/github
// @desc    Redirect to GitHub for authentication
// @access  Public
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// @route   GET /auth/github/callback
// @desc    GitHub callback URL
// @access  Public
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/login-failed' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/api-docs'); // Redirect to Swagger after login
  }
);

// @route   GET /auth/logout
// @desc    Logout user
// @access  Public
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// @route   GET /auth/login-failed
// @desc    Login failure page
// @access  Public
router.get('/login-failed', (req, res) => {
  res.status(401).json({ message: 'Login failed. Please try again.' });
});

// @route   GET /auth/status
// @desc    Check authentication status
// @access  Public
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      authenticated: true, 
      user: {
        username: req.user.username,
        displayName: req.user.displayName
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;