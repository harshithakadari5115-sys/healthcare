from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

# Load trained model and vectorizer
try:
    classifier = joblib.load('doctor_specialization_model.pkl')
    vectorizer = joblib.load('tfidf_vectorizer.pkl')
    print("Model and vectorizer loaded successfully!")
except:
    print("Warning: Model files not found. Please train the model first using train_model.py")
    classifier = None
    vectorizer = None

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        problem = data.get('problem', '')
        
        if not problem:
            return jsonify({'error': 'Problem description is required'}), 400
        
        if classifier is None or vectorizer is None:
            # Fallback to keyword-based prediction
            specialization = keyword_based_prediction(problem)
            return jsonify({'specialization': specialization})
        
        # Transform input and predict
        problem_tfidf = vectorizer.transform([problem.lower()])
        prediction = classifier.predict(problem_tfidf)[0]
        
        return jsonify({'specialization': prediction})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def keyword_based_prediction(problem):
    """Fallback keyword-based prediction"""
    problem_lower = problem.lower()
    
    specializations = {
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
    }
    
    for spec, keywords in specializations.items():
        for keyword in keywords:
            if keyword in problem_lower:
                return spec
    
    return 'General Physician'

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML service is running'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)