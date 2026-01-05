const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientPhone: {
    type: String,
    required: true,
    ref: 'Patient'
  },
  doctorPhone: {
    type: String,
    required: true,
    ref: 'Doctor'
  },
  patientName: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  problem: {
    type: String,
    required: true
  },
  suggestedSpecialization: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  consultationFee: {
    type: Number,
    required: true
  },
  prescriptionFile: {
    type: String,
    default: null
  },
  diagnosis: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);