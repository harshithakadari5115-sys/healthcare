const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientPhone: {
    type: String,
    required: true,
    ref: 'Patient'
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  doctorSpecialization: {
    type: String,
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  problem: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  prescription: {
    type: String,
    required: true
  },
  testReports: [{
    testName: String,
    reportUrl: String,
    uploadDate: Date
  }],
  followUpDate: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);