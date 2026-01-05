import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MedicalRecords({ user, onLogout }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch appointments
      const appointmentsResponse = await axios.get(
        `/api/appointments/patient/${user.phoneNumber}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAppointments(appointmentsResponse.data);

      // Fetch medical records
      const recordsResponse = await axios.get(
        `/api/appointments/records/${user.phoneNumber}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMedicalRecords(recordsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
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
        <h1>Healthcare Finder</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {user.fullName}</span>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Find Doctor
          </button>
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h2 style={{ color: '#667eea', marginBottom: '20px' }}>My Health Records</h2>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '30px',
            borderBottom: '2px solid #e0e0e0'
          }}>
            <button
              onClick={() => setActiveTab('appointments')}
              style={{
                padding: '15px 30px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'appointments' ? '3px solid #667eea' : 'none',
                color: activeTab === 'appointments' ? '#667eea' : '#666',
                fontWeight: activeTab === 'appointments' ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Appointments ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('records')}
              style={{
                padding: '15px 30px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'records' ? '3px solid #667eea' : 'none',
                color: activeTab === 'records' ? '#667eea' : '#666',
                fontWeight: activeTab === 'records' ? 'bold' : 'normal',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Medical Records ({medicalRecords.length})
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div>
                  {appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <p style={{ fontSize: '18px' }}>No appointments found</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/dashboard')}
                        style={{ marginTop: '20px' }}
                      >
                        Book Your First Appointment
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {appointments.map((appointment) => (
                        <div 
                          key={appointment._id} 
                          className="card" 
                          style={{ background: '#f8f9fa', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '15px'
                          }}>
                            <h4 style={{ color: '#333', margin: 0 }}>Dr. {appointment.doctorName}</h4>
                            <span style={{
                              padding: '5px 15px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              background: appointment.status === 'Scheduled' ? '#ffc107' : 
                                         appointment.status === 'Completed' ? '#28a745' : '#dc3545',
                              color: 'white'
                            }}>
                              {appointment.status}
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <p><strong>Specialization:</strong> {appointment.suggestedSpecialization}</p>
                            <p><strong>Date:</strong> {formatDate(appointment.appointmentDate)}</p>
                            <p><strong>Time:</strong> {appointment.appointmentTime}</p>
                            <p><strong>Fee:</strong> ₹{appointment.consultationFee}</p>
                          </div>

                          <div style={{ 
                            marginTop: '15px', 
                            padding: '10px', 
                            background: 'white', 
                            borderRadius: '5px' 
                          }}>
                            <strong>Problem:</strong>
                            <p style={{ margin: '5px 0 0 0', color: '#666' }}>{appointment.problem}</p>
                          </div>

                          {appointment.diagnosis && (
                            <div style={{ 
                              marginTop: '10px', 
                              padding: '10px', 
                              background: '#e8f5e9', 
                              borderRadius: '5px' 
                            }}>
                              <strong>Diagnosis:</strong>
                              <p style={{ margin: '5px 0 0 0', color: '#2e7d32' }}>{appointment.diagnosis}</p>
                            </div>
                          )}

                          <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                            Booked on: {formatDate(appointment.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Medical Records Tab */}
              {activeTab === 'records' && (
                <div>
                  {medicalRecords.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <p style={{ fontSize: '18px' }}>No medical records found</p>
                      <p>Your medical records will appear here after completing appointments</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {medicalRecords.map((record) => (
                        <div 
                          key={record._id} 
                          className="card" 
                          style={{ background: '#f8f9fa', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        >
                          <div style={{ marginBottom: '15px' }}>
                            <h4 style={{ color: '#333', marginBottom: '5px' }}>
                              Dr. {record.doctorName}
                            </h4>
                            <p style={{ color: '#666', margin: 0 }}>{record.doctorSpecialization}</p>
                          </div>

                          <div style={{ marginBottom: '15px' }}>
                            <p><strong>Visit Date:</strong> {formatDate(record.visitDate)}</p>
                          </div>

                          <div style={{ 
                            padding: '10px', 
                            background: 'white', 
                            borderRadius: '5px',
                            marginBottom: '10px'
                          }}>
                            <strong>Problem:</strong>
                            <p style={{ margin: '5px 0 0 0', color: '#666' }}>{record.problem}</p>
                          </div>

                          <div style={{ 
                            padding: '10px', 
                            background: '#e3f2fd', 
                            borderRadius: '5px',
                            marginBottom: '10px'
                          }}>
                            <strong>Diagnosis:</strong>
                            <p style={{ margin: '5px 0 0 0', color: '#1565c0' }}>{record.diagnosis}</p>
                          </div>

                          <div style={{ 
                            padding: '10px', 
                            background: '#fff3e0', 
                            borderRadius: '5px',
                            marginBottom: '10px'
                          }}>
                            <strong>Prescription:</strong>
                            <p style={{ margin: '5px 0 0 0', color: '#e65100' }}>{record.prescription}</p>
                          </div>

                          {record.notes && (
                            <div style={{ 
                              padding: '10px', 
                              background: '#f3e5f5', 
                              borderRadius: '5px',
                              marginBottom: '10px'
                            }}>
                              <strong>Notes:</strong>
                              <p style={{ margin: '5px 0 0 0', color: '#6a1b9a' }}>{record.notes}</p>
                            </div>
                          )}

                          {record.followUpDate && (
                            <p style={{ marginTop: '10px' }}>
                              <strong>Follow-up Date:</strong> {formatDate(record.followUpDate)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MedicalRecords;