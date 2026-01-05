import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DoctorDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `/api/appointments/doctor/${user.phoneNumber}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    setUpdatingAvailability(true);
    try {
      await axios.patch(
        '/api/doctors/availability',
        { isAvailable: !isAvailable },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setIsAvailable(!isAvailable);
    } catch (err) {
      alert('Failed to update availability: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      <div className="header">
        <h1>🏥 Healthcare Finder</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, Dr. {user.fullName}</span>
          <button className="btn btn-success" onClick={handleAvailabilityToggle} disabled={updatingAvailability}>
            {isAvailable ? '✅ Available' : '❌ Unavailable'}
          </button>
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        {/* Success Message Card */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          padding: '40px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ color: 'white', marginBottom: '15px', fontSize: '32px' }}>
            Registration Successful!
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '20px', opacity: 0.95 }}>
            You have been successfully registered as a doctor.
          </p>
          <p style={{ fontSize: '16px', opacity: 0.9 }}>
            Patients can now find and book appointments with you. Manage your appointments below.
          </p>
        </div>

        {/* Appointments Section */}
        <div className="card">
          <h2 style={{ color: '#667eea', marginBottom: '20px' }}>
            📅 My Appointments ({appointments.length})
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="loading-spinner"></div>
              <p>Loading appointments...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
              <p style={{ fontSize: '18px' }}>No appointments scheduled yet</p>
              <p style={{ marginTop: '10px', color: '#999' }}>
                Your appointments will appear here when patients book with you
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {appointments.map((appointment) => (
                <div 
                  key={appointment._id} 
                  className="card" 
                  style={{ 
                    background: '#f8f9fa', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderLeft: `4px solid ${appointment.status === 'Scheduled' ? '#ffc107' : 
                                 appointment.status === 'Completed' ? '#28a745' : '#dc3545'}`
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h4 style={{ color: '#333', margin: 0 }}>
                      👤 Patient: {appointment.patientName}
                    </h4>
                    <span style={{
                      padding: '8px 20px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      background: appointment.status === 'Scheduled' ? '#ffc107' : 
                                 appointment.status === 'Completed' ? '#28a745' : '#dc3545',
                      color: 'white'
                    }}>
                      {appointment.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                      <strong>📅 Date:</strong> {formatDate(appointment.appointmentDate)}
                    </div>
                    <div>
                      <strong>🕐 Time:</strong> {appointment.appointmentTime}
                    </div>
                    <div>
                      <strong>💰 Fee:</strong> ₹{appointment.consultationFee}
                    </div>
                    <div>
                      <strong>🏥 Specialization:</strong> {appointment.suggestedSpecialization}
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: '15px', 
                    padding: '15px', 
                    background: 'white', 
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <strong>📝 Problem Description:</strong>
                    <p style={{ margin: '8px 0 0 0', color: '#666', lineHeight: '1.6' }}>
                      {appointment.problem}
                    </p>
                  </div>

                  {appointment.diagnosis && (
                    <div style={{ 
                      marginTop: '15px', 
                      padding: '15px', 
                      background: '#e8f5e9', 
                      borderRadius: '8px' 
                    }}>
                      <strong>✅ Diagnosis:</strong>
                      <p style={{ margin: '8px 0 0 0', color: '#2e7d32' }}>{appointment.diagnosis}</p>
                    </div>
                  )}

                  <p style={{ marginTop: '15px', fontSize: '12px', color: '#999' }}>
                    Booked on: {formatDate(appointment.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;


