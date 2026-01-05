import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Sample dataset - In production, use a real medical dataset
data = {
    'symptoms': [
        'fever cold cough body pain',
        'chest pain breathing difficulty heart palpitation',
        'skin rash itching acne pigmentation',
        'baby fever vaccination child growth',
        'bone fracture joint pain knee pain back pain',
        'headache migraine seizure paralysis',
        'depression anxiety stress mental health',
        'pregnancy menstrual period cramps',
        'ear pain throat infection hearing loss',
        'tooth pain cavity dental gum bleeding',
        'eye pain vision problem sight blur',
        'stomach pain digestive liver acid reflux',
        'high fever viral infection weakness fatigue',
        'cardiac arrest heart attack blood pressure',
        'eczema hair loss nail problem',
        'infant vaccination pediatric checkup',
        'arthritis muscle pain spine issue',
        'brain stroke nerve damage neurological',
        'panic attack mood disorder psychological',
        'ovarian cyst pcos women health',
        'tonsil sinus nose blocked voice hoarse',
        'jaw pain oral infection teeth alignment',
        'cataract retina problem glasses needed',
        'constipation gastric ulcer intestine problem'
    ],
    'specialization': [
        'General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician',
        'Orthopedic', 'Neurologist', 'Psychiatrist', 'Gynecologist',
        'ENT Specialist', 'Dentist', 'Ophthalmologist', 'Gastroenterologist',
        'General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician',
        'Orthopedic', 'Neurologist', 'Psychiatrist', 'Gynecologist',
        'ENT Specialist', 'Dentist', 'Ophthalmologist', 'Gastroenterologist'
    ]
}

# Create DataFrame
df = pd.DataFrame(data)

# Split data
X = df['symptoms']
y = df['specialization']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create TF-IDF vectorizer
vectorizer = TfidfVectorizer(max_features=100)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# Train Naive Bayes classifier
classifier = MultinomialNB()
classifier.fit(X_train_tfidf, y_train)

# Test accuracy
y_pred = classifier.predict(X_test_tfidf)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save model and vectorizer
joblib.dump(classifier, 'doctor_specialization_model.pkl')
joblib.dump(vectorizer, 'tfidf_vectorizer.pkl')
print("\nModel and vectorizer saved successfully!")

# Test with sample input
test_symptoms = ["I have severe chest pain and difficulty breathing"]
test_tfidf = vectorizer.transform(test_symptoms)
prediction = classifier.predict(test_tfidf)
print(f"\nTest Prediction for '{test_symptoms[0]}':")
print(f"Recommended Specialist: {prediction[0]}")