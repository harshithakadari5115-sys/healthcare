import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <h1 style={{ color: '#667eea', marginBottom: '20px', fontSize: '36px' }}>
          Healthcare Doctor Finder
        </h1>
        <p style={{ color: '#666', marginBottom: '40px', fontSize: '18px' }}>
          Find the best doctors near you and manage your health records
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
            style={{ width: '100%', fontSize: '18px', padding: '15px' }}
          >
            🔐 Login
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <button 
              className="btn btn-success"
              onClick={() => navigate('/register/patient')}
              style={{ padding: '15px', fontSize: '16px' }}
            >
              👤 Register as Patient
            </button>
            <button 
              className="btn btn-info"
              onClick={() => navigate('/register/doctor')}
              style={{ padding: '15px', fontSize: '16px' }}
            >
              👨‍⚕️ Register as Doctor
            </button>
          </div>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Features</h3>
          <ul style={{ textAlign: 'left', color: '#666', lineHeight: '2' }}>
            <li>🔍 Find nearby doctors based on your symptoms</li>
            <li>🤖 AI-powered doctor recommendation</li>
            <li>📅 Easy appointment booking</li>
            <li>📋 Complete medical records history</li>
            <li>📱 Linked with your phone number</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;