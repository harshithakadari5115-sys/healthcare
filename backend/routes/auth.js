const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Patient Registration
router.post('/register/patient', async (req, res) => {
  try {
    const { phoneNumber, password, fullName, email, dateOfBirth, gender, bloodGroup, 
            address, location, allergies, currentMedications, chronicConditions, emergencyContact } = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ phoneNumber });
    if (existingPatient) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new patient
    const patient = new Patient({
      phoneNumber,
      password: hashedPassword,
      fullName,
      email,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      location,
      allergies,
      currentMedications,
      chronicConditions,
      emergencyContact
    });

    await patient.save();

    // Generate token
    const token = jwt.sign(
      { phoneNumber: patient.phoneNumber, userType: 'patient' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Patient registered successfully',
      token,
      user: {
        phoneNumber: patient.phoneNumber,
        fullName: patient.fullName,
        userType: 'patient'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Doctor Registration
router.post('/register/doctor', async (req, res) => {
  try {
    const { phoneNumber, password, fullName, email, gender, dateOfBirth,
            medicalLicenseNumber, specialization, qualification, yearsOfExperience,
            clinicName, clinicAddress, location, consultationFee, availability } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ phoneNumber });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new doctor
    const doctor = new Doctor({
      phoneNumber,
      password: hashedPassword,
      fullName,
      email,
      gender,
      dateOfBirth,
      medicalLicenseNumber,
      specialization,
      qualification,
      yearsOfExperience,
      clinicName,
      clinicAddress,
      location,
      consultationFee,
      availability
    });

    await doctor.save();

    // Generate token
    const token = jwt.sign(
      { phoneNumber: doctor.phoneNumber, userType: 'doctor' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Doctor registered successfully',
      token,
      user: {
        phoneNumber: doctor.phoneNumber,
        fullName: doctor.fullName,
        userType: 'doctor'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password, userType } = req.body;

    let user;
    if (userType === 'patient') {
      user = await Patient.findOne({ phoneNumber });
    } else if (userType === 'doctor') {
      user = await Doctor.findOne({ phoneNumber });
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { phoneNumber: user.phoneNumber, userType },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        userType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;