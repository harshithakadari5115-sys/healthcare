const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const auth = require('../middleware/auth');

// Find nearby doctors by specialization
router.post('/find-nearby', auth, async (req, res) => {
  try {
    const { specialization, latitude, longitude, maxDistance = 10000 } = req.body;

    const doctors = await Doctor.find({
      specialization,
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance // meters
        }
      }
    }).select('-password');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get doctor by phone number
router.get('/:phoneNumber', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ phoneNumber: req.params.phoneNumber }).select('-password');
    
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update doctor availability
router.patch('/availability', auth, async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { phoneNumber: req.user.phoneNumber },
      { isAvailable },
      { new: true }
    ).select('-password');

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;