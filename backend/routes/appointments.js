 const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const auth = require('../middleware/auth');

// Book an appointment
router.post('/book', auth, async (req, res) => {
  try {
    const { doctorPhone, doctorName, problem, suggestedSpecialization, 
            appointmentDate, appointmentTime, consultationFee } = req.body;

    const appointment = new Appointment({
      patientPhone: req.user.phoneNumber,
      doctorPhone,
      patientName: req.body.patientName,
      doctorName,
      problem,
      suggestedSpecialization,
      appointmentDate,
      appointmentTime,
      consultationFee
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient's appointments
router.get('/patient/:phoneNumber', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      patientPhone: req.params.phoneNumber 
    }).sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get doctor's appointments
router.get('/doctor/:phoneNumber', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      doctorPhone: req.params.phoneNumber 
    }).sort({ appointmentDate: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete appointment and add medical record
router.post('/complete/:appointmentId', auth, async (req, res) => {
  try {
    const { diagnosis, prescription, notes, testReports } = req.body;

    // Update appointment
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { 
        status: 'Completed',
        diagnosis,
        notes
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Create medical record
    const medicalRecord = new MedicalRecord({
      patientPhone: appointment.patientPhone,
      appointmentId: appointment._id,
      doctorName: appointment.doctorName,
      doctorSpecialization: appointment.suggestedSpecialization,
      visitDate: appointment.appointmentDate,
      problem: appointment.problem,
      diagnosis,
      prescription,
      testReports,
      notes
    });

    await medicalRecord.save();

    res.json({
      message: 'Appointment completed and medical record created',
      appointment,
      medicalRecord
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get medical records for a patient
router.get('/records/:phoneNumber', auth, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ 
      patientPhone: req.params.phoneNumber 
    }).sort({ visitDate: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;