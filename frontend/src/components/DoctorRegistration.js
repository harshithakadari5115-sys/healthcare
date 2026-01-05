import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from './ProgressBar';

function DoctorRegistration({ onRegister }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const steps = ['Phone & Auth', 'Personal Details', 'Professional Credentials', 'Practice Details'];
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    medicalLicenseNumber: '',
    specialization: '',
    qualification: '',
    yearsOfExperience: '',
    clinicName: '',
    clinicAddress: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    location: {
      type: 'Point',
      coordinates: [0, 0]
    },
    consultationFee: '',
    availability: [
      { day: 'Monday', slots: [{ startTime: '09:00', endTime: '17:00' }] }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    setLocationStatus('Getting clinic location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setFormData({
          ...formData,
          location: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        });
        
        setLocationStatus(`✅ Location captured! (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        setLocationLoading(false);
      },
      (error) => {
        let errorMsg = 'Unable to get location. ';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMsg += 'Location request timed out.';
            break;
          default:
            errorMsg += 'An unknown error occurred.';
            break;
        }
        setLocationStatus(`❌ ${errorMsg}`);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const nextStep = () => {
    if (currentStep === 0) {
      if (!formData.phoneNumber || !formData.password || !formData.confirmPassword) {
        setError('Please fill all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register/doctor', formData);
      onRegister(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#667eea', marginBottom: '30px' }}>
          Doctor Registration
        </h2>

        <ProgressBar currentStep={currentStep} totalSteps={steps.length} steps={steps} />

        <form onSubmit={handleSubmit}>
          {/* Step 0: Phone & Authentication */}
          {currentStep === 0 && (
            <div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Professional Credentials */}
          {currentStep === 2 && (
            <div>
              <div className="form-group">
                <label>Medical License Number *</label>
                <input
                  type="text"
                  name="medicalLicenseNumber"
                  value={formData.medicalLicenseNumber}
                  onChange={handleChange}
                  placeholder="Enter your license number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Specialization *</label>
                <select name="specialization" value={formData.specialization} onChange={handleChange} required>
                  <option value="">Select Specialization</option>
                  <option value="General Physician">General Physician</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="ENT Specialist">ENT Specialist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                </select>
              </div>

              <div className="form-group">
                <label>Qualification *</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g., MBBS, MD"
                  required
                />
              </div>

              <div className="form-group">
                <label>Years of Experience *</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Practice Details */}
          {currentStep === 3 && (
            <div>
              <div className="form-group">
                <label>Clinic/Hospital Name *</label>
                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  placeholder="Enter clinic/hospital name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Clinic Street Address *</label>
                <input
                  type="text"
                  name="clinicAddress.street"
                  value={formData.clinicAddress.street}
                  onChange={handleChange}
                  placeholder="Enter street address"
                  required
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="clinicAddress.city"
                  value={formData.clinicAddress.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="clinicAddress.state"
                  value={formData.clinicAddress.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="clinicAddress.pincode"
                  value={formData.clinicAddress.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  required
                />
              </div>

              <button
                type="button"
                className="btn btn-location"
                onClick={getLocation}
                disabled={locationLoading}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                {locationLoading ? '📍 Getting Location...' : '📍 Capture Clinic Location'}
              </button>
              {locationStatus && (
                <div style={{ 
                  padding: '10px', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  marginBottom: '20px',
                  background: locationStatus.includes('✅') ? '#d4edda' : '#f8d7da',
                  color: locationStatus.includes('✅') ? '#155724' : '#721c24',
                  border: `1px solid ${locationStatus.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                  {locationStatus}
                </div>
              )}

              <div className="form-group">
                <label>Consultation Fee (₹) *</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  placeholder="Enter consultation fee"
                  required
                />
              </div>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
            {currentStep > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
                style={{ flex: 1, fontSize: '16px', padding: '12px' }}
              >
                ⬅️ Previous
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
                style={{ flex: 1, fontSize: '16px', padding: '12px' }}
              >
                ➡️ Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
                style={{ flex: 1, fontSize: '16px', padding: '12px' }}
              >
                {loading ? '⏳ Registering...' : '✅ Complete Registration'}
              </button>
            )}
          </div>
        </form>

        <button
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: '15px', fontSize: '15px', padding: '12px' }}
          onClick={() => navigate('/')}
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}

export default DoctorRegistration;