const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Registration = require('../models/Registration');

// Create registration (user only)
router.post('/', auth,  async (req, res) => {
  try {
    const registration = new Registration({
      user: req.user.id,
      ...req.body
    });

    await registration.save();
    res.json(registration);
  } catch (err) {
    console.error(err.message);
    
    // Handle duplicate regNumber error
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Registration number already exists' });
    }
    
    res.status(500).send('Server error');
  }
});

// Get all registrations (admin only)
router.get('/', auth, roleCheck('admin'), async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); // Newest first
    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's own registrations
router.get('/my-registrations', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .sort({ createdAt: -1 }); // Newest first
    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update registration (users can edit their own, admins can edit all)
router.put('/:id', auth, async (req, res) => {
  try {
    let registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ msg: 'Registration not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin') {
      // User can only edit their own registrations
      if (registration.user.toString() !== req.user.id) {
        return res.status(403).json({ 
          msg: 'Not authorized to edit this registration' 
        });
      }
    }

    // Prevent users from changing registration number
    if (req.user.role === 'user' && req.body.regNumber) {
      if (req.body.regNumber !== registration.regNumber) {
        return res.status(400).json({ 
          msg: 'Cannot change registration number' 
        });
      }
    }

    registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json(registration);
  } catch (err) {
    console.error(err.message);
    
    // Handle duplicate regNumber error
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Registration number already exists' });
    }
    
    res.status(500).send('Server error');
  }
});

// Delete registration (users can delete their own, admins can delete all)
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ msg: 'Registration not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin') {
      // User can only delete their own registrations
      if (registration.user.toString() !== req.user.id) {
        return res.status(403).json({ 
          msg: 'Not authorized to delete this registration' 
        });
      }
    }

    await registration.deleteOne();
    res.json({ msg: 'Registration removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single registration by ID (users can view their own, admins can view all)
router.get('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ msg: 'Registration not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin') {
      // User can only view their own registrations
      if (registration.user.toString() !== req.user.id) {
        return res.status(403).json({ 
          msg: 'Not authorized to view this registration' 
        });
      }
    }

    res.json(registration);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;