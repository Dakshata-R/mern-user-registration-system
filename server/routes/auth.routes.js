const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');

// Initialize Google OAuth2 client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user.id, role: user.role } },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role  } = req.body; // Added role with default

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Validate role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role specified' });
    }

    // Create user with role
    user = new User({
      name,
      email,
      password,
      role 
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    const responseData = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    
    
    res.json(responseData);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

     const responseData = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    
    
    res.json(responseData); 
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Google OAuth Routes (Traditional)
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/auth-success?token=${token}`);
  }
);

// NEW: Google ID Token Verification (for @react-oauth/google)
router.post('/google', async (req, res) => {
   try {
   
    const { token } = req.body;
    
    if (!token) {
    
      return res.status(400).json({ msg: 'Google token is required' });
    }

    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    const { sub: googleId, name, email } = payload;
    
    // Check if user exists
    let user = await User.findOne({ googleId });
    
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        // Link Google account to existing email
        user.googleId = googleId;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          googleId,
          name,
          email,
          role:'user'
        });
      }
    }
    
    // Generate your own JWT token
    const jwtToken = generateToken(user);
    
    
    const responseData = {
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
     res.status(200).json(responseData);

  } catch (err) {
    console.error('Google auth detailed error:', err);
    res.status(401).json({ msg: 'Google authentication failed: ' + err.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ msg: 'Logged out successfully' });
});

module.exports = router;