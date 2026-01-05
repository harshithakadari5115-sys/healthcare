import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import {API_URL} from "../api";
function PatientRegistration({ onRegister }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const steps = ['Phone & Auth', 'Basic Info', 'Address & Location'];
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    location: {
      type: 'Point',
      coordinates: [0, 0]
    },
    allergies: '',
    currentMedications: '',
    chronicConditions: '',
    emergencyContact: {
      name: '',
      phone: ''
    }
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
    setLocationStatus('Getting your location...');

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
    // Validate step 0
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
    // Validate step 1
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.dateOfBirth || !formData.gender) {
        setError('Please fill all required fields');
        return;
      }
    }
    // Step 2 (Address & Location) - no validation needed, can skip
    setError('');
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
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
      const dataToSend = {
        ...formData,
        allergies: [],
        currentMedications: [],
        chronicConditions: [],
        emergencyContact: {
          name: '',
          phone: ''
        }
      };

      const response = await axios.post('${API_URL}/api/auth/register/patient', dataToSend);
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
          Patient Registration
        </h2>

        <ProgressBar currentStep={currentStep} totalSteps={steps.length} steps={steps} />

        <form onSubmit={(e) => {
          e.preventDefault();
          // Only submit if we're on the last step
          if (currentStep === steps.length - 1) {
            handleSubmit(e);
          } else {
            // Otherwise, go to next step
            nextStep();
          }
        }}>
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

          {/* Step 1: Basic Info */}
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
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
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
                <label>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Address & Location */}
          {currentStep === 2 && (
            <div>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Enter street address"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>

              <button
                type="button"
                className="btn btn-location"
                onClick={getLocation}
                disabled={locationLoading}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                {locationLoading ? '📍 Getting Location...' : '📍 Capture Current Location'}
              </button>
              {locationStatus && (
                <div style={{ 
                  padding: '10px', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  marginBottom: '10px',
                  background: locationStatus.includes('✅') ? '#d4edda' : '#f8d7da',
                  color: locationStatus.includes('✅') ? '#155724' : '#721c24',
                  border: `1px solid ${locationStatus.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                  {locationStatus}
                </div>
              )}
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

export default PatientRegistration;