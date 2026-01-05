import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PatientRegistration from './components/PatientRegistration';
import DoctorRegistration from './components/DoctorRegistration';
import FindDoctor from './components/FindDoctor';
import DoctorDashboard from './components/DoctorDashboard';
import MedicalRecords from './components/MedicalRecords';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/register/patient" element={user ? <Navigate to="/dashboard" /> : <PatientRegistration onRegister={handleLogin} />} />
          <Route path="/register/doctor" element={user ? <Navigate to="/dashboard" /> : <DoctorRegistration onRegister={handleLogin} />} />
          <Route path="/dashboard" element={
            user ? (
              user.userType === 'doctor' ? 
                <DoctorDashboard user={user} onLogout={handleLogout} /> : 
                <FindDoctor user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          } />
          <Route path="/medical-records" element={user ? <MedicalRecords user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;