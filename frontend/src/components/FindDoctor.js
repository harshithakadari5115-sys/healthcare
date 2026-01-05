import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FindDoctor({ user, onLogout }) {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [suggestedSpecialization, setSuggestedSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    date: '',
    time: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleFindDoctors = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowDoctors(false);

    try {
      // Get ML prediction for specialization
      const mlResponse = await axios.post('/api/ml/predict-specialization', { problem }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const specialization = mlResponse.data.specialization;
      setSuggestedSpecialization(specialization);

      // Get user's current location
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Find nearby doctors
            const doctorsResponse = await axios.post('/api/doctors/find-nearby', {
              specialization,
              latitude: lat,
              longitude: lng,
              maxDistance: 50000 // 50km radius
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setDoctors(doctorsResponse.data);
            setShowDoctors(true);
          } catch (err) {
            alert('Error finding doctors: ' + (err.response?.data?.error || err.message));
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          let errorMsg = 'Unable to get your location. ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMsg += 'Please allow location access in your browser settings to find nearby doctors.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMsg += 'Location request timed out. Please try again.';
              break;
            default:
              errorMsg += 'An unknown error occurred.';
              break;
          }
          alert(errorMsg);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  const handleBookAppointment = async (doctor) => {
    setSelectedDoctor(doctor);
  };

  const confirmBooking = async () => {
    if (!appointmentDetails.date || !appointmentDetails.time) {
      alert('Please select date and time');
      return;
    }

    setBookingLoading(true);
    try {
      await axios.post('/api/appointments/book', {
        doctorPhone: selectedDoctor.phoneNumber,
        doctorName: selectedDoctor.fullName,
        patientName: user.fullName,
        problem,
        suggestedSpecialization,
        appointmentDate: appointmentDetails.date,
        appointmentTime: appointmentDetails.time,
        consultationFee: selectedDoctor.consultationFee
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('Appointment booked successfully!');
      setSelectedDoctor(null);
      setAppointmentDetails({ date: '', time: '' });
    } catch (err) {
      alert('Booking failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Healthcare Finder</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {user.fullName}</span>
          <button className="btn btn-secondary" onClick={() => navigate('/medical-records')}>
            My Records
          </button>
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h2 style={{ color: '#667eea', marginBottom: '20px' }}>Find a Doctor</h2>
          
          <form onSubmit={handleFindDoctors}>
            <div className="form-group">
              <label>Describe your problem or symptoms</label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="e.g., I have chest pain and difficulty breathing..."
                rows="4"
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', fontSize: '16px', padding: '15px' }}
            >
              {loading ? '🔍 Finding Doctors...' : '🔍 Find Nearby Doctors'}
            </button>
          </form>

          {suggestedSpecialization && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
              <strong>🤖 AI Suggestion:</strong> Based on your symptoms, we recommend seeing a <strong>{suggestedSpecialization}</strong>
            </div>
          )}
        </div>

        {showDoctors && (
          <div className="card">
            <h3 style={{ color: '#667eea', marginBottom: '20px' }}>
              Available {suggestedSpecialization}s Near You ({doctors.length} found)
            </h3>

            {doctors.length === 0 ? (
              <p>No doctors found in your area. Try searching in a wider radius.</p>
            ) : (
              <div className="grid">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="card" style={{ background: '#f8f9fa' }}>
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>Dr. {doctor.fullName}</h4>
                    <p><strong>Specialization:</strong> {doctor.specialization}</p>
                    <p><strong>Qualification:</strong> {doctor.qualification}</p>
                    <p><strong>Experience:</strong> {doctor.yearsOfExperience} years</p>
                    <p><strong>Clinic:</strong> {doctor.clinicName}</p>
                    <p><strong>Address:</strong> {doctor.clinicAddress.street}, {doctor.clinicAddress.city}</p>
                    <p><strong>Consultation Fee:</strong> ₹{doctor.consultationFee}</p>
                    <p><strong>Rating:</strong> ⭐ {doctor.rating.toFixed(1)} ({doctor.totalReviews} reviews)</p>
                    
                    <button
                      className="btn btn-success"
                      onClick={() => handleBookAppointment(doctor)}
                      style={{ width: '100%', marginTop: '15px', fontSize: '15px', padding: '12px' }}
                    >
                      📅 Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Appointment Booking Modal */}
        {selectedDoctor && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
              <h3 style={{ color: '#667eea', marginBottom: '20px' }}>
                Book Appointment with Dr. {selectedDoctor.fullName}
              </h3>

              <div className="form-group">
                <label>Select Date</label>
                <input
                  type="date"
                  value={appointmentDetails.date}
                  onChange={(e) => setAppointmentDetails({ ...appointmentDetails, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Time</label>
                <select
                  value={appointmentDetails.time}
                  onChange={(e) => setAppointmentDetails({ ...appointmentDetails, time: e.target.value })}
                  required
                >
                  <option value="">Choose a time slot</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>

              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <p><strong>Problem:</strong> {problem}</p>
                <p><strong>Consultation Fee:</strong> ₹{selectedDoctor.consultationFee}</p>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedDoctor(null)}
                  style={{ flex: 1 }}
                >
                  ❌ Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={confirmBooking}
                  disabled={bookingLoading}
                  style={{ flex: 1 }}
                >
                  {bookingLoading ? '⏳ Booking...' : '✅ Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FindDoctor;