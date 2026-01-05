const express = require('express');
const router = express.Router();
const axios = require('axios');

// Predict doctor specialization based on problem
router.post('/predict-specialization', async (req, res) => {
  try {
    const { problem } = req.body;

    // For now, using a simple keyword-based matching
    // In production, you'll call your Python ML model API
    const specialization = predictSpecialization(problem);

    res.json({ specialization });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple keyword-based prediction (replace with actual ML model)
function predictSpecialization(problem) {
  const problemLower = problem.toLowerCase();

  const specializations = {
    'General Physician': ['fever', 'cold', 'cough', 'flu', 'infection', 'general', 'body pain', 'weakness'],
    'Cardiologist': ['heart', 'chest pain', 'blood pressure', 'cardiac', 'palpitation', 'hypertension'],
    'Dermatologist': ['skin', 'rash', 'acne', 'hair', 'nail', 'itching', 'pigmentation', 'eczema'],
    'Pediatrician': ['child', 'baby', 'infant', 'kid', 'vaccination', 'growth'],
    'Orthopedic': ['bone', 'fracture', 'joint', 'knee', 'back pain', 'spine', 'arthritis', 'muscle'],
    'Neurologist': ['headache', 'migraine', 'brain', 'nerve', 'seizure', 'paralysis', 'neurological'],
    'Psychiatrist': ['depression', 'anxiety', 'stress', 'mental', 'psychological', 'mood', 'panic'],
    'Gynecologist': ['pregnancy', 'menstrual', 'period', 'women', 'uterus', 'ovarian', 'pcos'],
    'ENT Specialist': ['ear', 'nose', 'throat', 'hearing', 'tonsil', 'sinus', 'voice'],
    'Dentist': ['tooth', 'teeth', 'dental', 'gum', 'cavity', 'jaw', 'oral'],
    'Ophthalmologist': ['eye', 'vision', 'sight', 'glasses', 'cataract', 'retina'],
    'Gastroenterologist': ['stomach', 'digestive', 'liver', 'intestine', 'gastric', 'acid', 'constipation']
  };

  for (const [spec, keywords] of Object.entries(specializations)) {
    for (const keyword of keywords) {
      if (problemLower.includes(keyword)) {
        return spec;
      }
    }
  }

  return 'General Physician'; // Default
}

module.exports = router;