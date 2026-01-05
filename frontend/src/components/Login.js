import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    userType: 'patient'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);
      onLogin(response.data.user, response.data.token);
      // Navigate based on user type
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', color: '#667eea', marginBottom: '30px' }}>
          Login to Your Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
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
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px', fontSize: '16px', padding: '15px' }}
            disabled={loading}
          >
            {loading ? '⏳ Logging in...' : '🔐 Login'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Don't have an account?{' '}
            <span
              style={{ color: '#667eea', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => navigate('/register/patient')}
            >
              Register as Patient
            </span>
            {' or '}
            <span
              style={{ color: '#667eea', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => navigate('/register/doctor')}
            >
              Register as Doctor
            </span>
          </p>
        </div>

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

export default Login;