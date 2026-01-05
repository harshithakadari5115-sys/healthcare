# Healthcare Doctor Finder App

A complete healthcare application that helps patients find nearby doctors based on their symptoms using ML-powered recommendations.

## Features

- 🔐 Separate login/registration for patients and doctors
- 📍 Location-based doctor search
- 🤖 ML-powered doctor specialization recommendation
- 📅 Appointment booking system
- 📋 Complete medical records history
- 📱 Phone number-based linking of all records

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt for password hashing

### ML Model
- Python
- Scikit-learn
- Flask API
- TF-IDF Vectorization
- Naive Bayes Classifier

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Python 3.8+
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd healthcare-app
```

### Step 2: Setup Backend

```bash
cd backend
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000" > .env

# Start MongoDB (if not running)
# On Mac: brew services start mongodb-community
# On Windows: net start MongoDB
# On Linux: sudo systemctl start mongod

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Setup Frontend

```bash
cd ../frontend
npm install

# Start frontend
npm start
```

Frontend will run on `http://localhost:3000`

### Step 4: Setup ML Model

```bash
cd ../ml-model

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model
python train_model.py

# Start ML prediction service
python predict.py
```

ML service will run on `http://localhost:5001`

## Usage

### For Patients

1. **Register**: Go to the homepage and click "Register as Patient"
2. Complete the 4-step registration:
   - Phone & Authentication
   - Basic Info
   - Address & Location (capture your location)
   - Medical History

3. **Login**: Use your phone number and password

4. **Find Doctors**:
   - Describe your symptoms/problem
   - AI will suggest the appropriate doctor specialization
   - View nearby doctors based on your location
   - See doctor details, ratings, and consultation fees

5. **Book Appointment**:
   - Select a doctor
   - Choose date and time
   - Confirm booking

6. **View Records**:
   - Access all your past appointments
   - View complete medical records
   - See prescriptions and diagnoses

### For Doctors

1. **Register**: Click "Register as Doctor"
2. Complete the 4-step registration:
   - Phone & Authentication
   - Personal Details
   - Professional Credentials
   - Practice Details (including clinic location)

3. **Login**: Use your phone number and password

4. **Manage Availability**: Update your availability status

5. **View Appointments**: See all scheduled appointments

## API Endpoints

### Authentication
- `POST /api/auth/register/patient` - Register new patient
- `POST /api/auth/register/doctor` - Register new doctor
- `POST /api/auth/login` - Login

### Doctors
- `POST /api/doctors/find-nearby` - Find nearby doctors by specialization
- `GET /api/doctors/:phoneNumber` - Get doctor details
- `PATCH /api/doctors/availability` - Update availability

### Appointments
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/patient/:phoneNumber` - Get patient appointments
- `GET /api/appointments/doctor/:phoneNumber` - Get doctor appointments
- `POST /api/appointments/complete/:appointmentId` - Complete appointment
- `GET /api/appointments/records/:phoneNumber` - Get medical records

### ML Prediction
- `POST /api/ml/predict-specialization` - Predict doctor specialization

## Database Schema

### Patient Collection
- phoneNumber (unique)
- password (hashed)
- fullName, email, dateOfBirth, gender, bloodGroup
- address (street, city, state, pincode)
- location (GeoJSON coordinates)
- allergies, currentMedications, chronicConditions
- emergencyContact

### Doctor Collection
- phoneNumber (unique)
- password (hashed)
- fullName, email, gender, dateOfBirth
- medicalLicenseNumber, specialization, qualification
- yearsOfExperience
- clinicName, clinicAddress
- location (GeoJSON coordinates)
- consultationFee, availability
- rating, totalReviews

### Appointment Collection
- patientPhone, doctorPhone
- patientName, doctorName
- problem, suggestedSpecialization
- appointmentDate, appointmentTime
- status (Scheduled/Completed/Cancelled)
- consultationFee
- diagnosis, notes

### MedicalRecord Collection
- patientPhone
- appointmentId
- doctorName, doctorSpecialization
- visitDate, problem, diagnosis
- prescription, testReports
- followUpDate, notes

## ML Model Details

The app uses a **Naive Bayes classifier** with **TF-IDF vectorization** to predict doctor specializations based on symptom descriptions.

### Training
- Dataset: Symptom descriptions mapped to specializations
- Features: TF-IDF vectors of symptom text
- Algorithm: Multinomial Naive Bayes
- Accuracy: ~80-90% (depends on training data)

### Specializations Supported
- General Physician
- Cardiologist
- Dermatologist
- Pediatrician
- Orthopedic
- Neurologist
- Psychiatrist
- Gynecologist
- ENT Specialist
- Dentist
- Ophthalmologist
- Gastroenterologist

## For GDG Hackathon

### Key Features to Highlight
1. **AI/ML Integration**: Real symptom-to-specialist matching
2. **Location-Based Search**: MongoDB geospatial queries
3. **Complete Health Records**: Phone-number linked history
4. **User-Friendly**: Step-by-step registration with progress bars
5. **Scalable Architecture**: Separate frontend, backend, and ML services

### Potential Improvements
- Add payment gateway integration
- Implement video consultation
- Add prescription image upload
- Create doctor rating system
- Send SMS/email notifications
- Add multi-language support
- Implement real-time chat

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Mac: brew services list | grep mongodb
# Linux: sudo systemctl status mongod
# Windows: Check Services panel
```

### Port Already in Use
```bash
# Find process using port
# Mac/Linux: lsof -i :5000
# Windows: netstat -ano | findstr :5000

# Kill the process or use different port
```

### ML Model Not Loading
```bash
# Make sure you've trained the model first
cd ml-model
python train_model.py
```

## License

MIT License - Feel free to use for your hackathon project!

## Contributors

[Your Team Name] for GDG Hackathon

---

Good luck with your hackathon! 🚀