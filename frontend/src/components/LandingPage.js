import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoModal from './InfoModal';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  const handleFooterLink = (type) => {
    const content = {
      'about': {
        title: 'About Us',
        content: (
          <div>
            <p><strong>HealthCare Pro</strong> is a comprehensive healthcare management platform designed to connect patients with the right medical professionals.</p>
            <p>Our mission is to make healthcare accessible, efficient, and user-friendly through technology.</p>
            <p>We provide AI-powered symptom analysis, location-based doctor search, digital medical records, and seamless appointment booking.</p>
          </div>
        )
      },
      'privacy': {
        title: 'Privacy Policy',
        content: (
          <div>
            <p><strong>Your Privacy Matters</strong></p>
            <p>We are committed to protecting your personal information and medical data.</p>
            <ul>
              <li>All medical records are encrypted and stored securely</li>
              <li>We never share your information with third parties without consent</li>
              <li>You have full control over your data and can delete it anytime</li>
              <li>HIPAA compliant data handling practices</li>
            </ul>
            <p>For more details, please contact our support team.</p>
          </div>
        )
      },
      'terms': {
        title: 'Terms of Service',
        content: (
          <div>
            <p><strong>Terms and Conditions</strong></p>
            <p>By using HealthCare Pro, you agree to:</p>
            <ul>
              <li>Provide accurate information during registration</li>
              <li>Use the platform only for legitimate healthcare purposes</li>
              <li>Respect doctor-patient confidentiality</li>
              <li>Not misuse the platform or its services</li>
            </ul>
            <p>We reserve the right to suspend accounts that violate these terms.</p>
          </div>
        )
      },
      'hipaa': {
        title: 'HIPAA Compliance',
        content: (
          <div>
            <p><strong>HIPAA Compliance</strong></p>
            <p>HealthCare Pro is committed to maintaining HIPAA compliance standards:</p>
            <ul>
              <li>Secure data transmission (SSL/TLS encryption)</li>
              <li>Access controls and authentication</li>
              <li>Audit logs for all data access</li>
              <li>Regular security assessments</li>
              <li>Business Associate Agreements with all partners</li>
            </ul>
            <p>Your Protected Health Information (PHI) is handled with the highest security standards.</p>
          </div>
        )
      },
      'help': {
        title: 'Help Center',
        content: (
          <div>
            <p><strong>Need Help?</strong></p>
            <p>We're here to assist you:</p>
            <ul>
              <li><strong>Email:</strong> support@healthcarepro.com</li>
              <li><strong>Phone:</strong> 1-800-HEALTH-PRO</li>
              <li><strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</li>
            </ul>
            <p>Common questions:</p>
            <ul>
              <li>How do I book an appointment?</li>
              <li>How do I upload medical records?</li>
              <li>How do I change my password?</li>
            </ul>
            <p>Visit our FAQ section for more answers.</p>
          </div>
        )
      },
      'faq': {
        title: 'Frequently Asked Questions',
        content: (
          <div>
            <p><strong>FAQ</strong></p>
            <p><strong>Q: How do I find a doctor?</strong></p>
            <p>A: Simply describe your symptoms, and our AI will suggest the right specialist. Then browse nearby doctors.</p>
            <p><strong>Q: Is my data secure?</strong></p>
            <p>A: Yes, all data is encrypted and stored securely following HIPAA guidelines.</p>
            <p><strong>Q: Can I cancel an appointment?</strong></p>
            <p>A: Yes, you can cancel or reschedule appointments from your dashboard.</p>
            <p><strong>Q: How do doctors register?</strong></p>
            <p>A: Click "I'm a Doctor" and complete the registration form with your credentials.</p>
          </div>
        )
      },
      'contact': {
        title: 'Contact Us',
        content: (
          <div>
            <p><strong>Get in Touch</strong></p>
            <p>We'd love to hear from you!</p>
            <ul>
              <li><strong>Email:</strong> contact@healthcarepro.com</li>
              <li><strong>Phone:</strong> 1-800-HEALTH-PRO</li>
              <li><strong>Address:</strong> 123 Healthcare Street, Medical City, MC 12345</li>
            </ul>
            <p>For business inquiries: business@healthcarepro.com</p>
            <p>For technical support: support@healthcarepro.com</p>
          </div>
        )
      }
    };

    if (content[type]) {
      setModalContent(content[type]);
      setShowModal(true);
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo(0, 0); }}>
            <strong>HealthCare Pro</strong>
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
            {/* Left Menu */}
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#how" onClick={(e) => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  How it Works
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Contact
                </a>
              </li>
            </ul>
            {/* Right Buttons */}
            <div className="d-flex">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container first-section p-5">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 mb-4">
            <h1 className="hero-title">Your Health,<br />Our Priority</h1>
            <h6 className="hero-subtitle">
              Book appointments with top doctors, manage medical records, and get AI-powered health insights - all in one platform
            </h6>
            <div className="mt-4">
              <button 
                className="btn btn-success me-3 mb-2 pa-button"
                onClick={() => navigate('/register/patient')}
              >
                I'm a Patient
              </button>
              <button 
                className="btn btn-info mb-2 pa-button"
                onClick={() => navigate('/register/doctor')}
              >
                I'm a Doctor
              </button>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 text-center">
            <img 
              src="https://th.bing.com/th/id/OIP.JGBmGdm8LIBhkidDg4pHMAHaE8?w=264&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1" 
              alt="Healthcare"
              className="hero-image"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="choose container items-center py-5">
        <div className="row">
          <div className="col-12 text-center mt-5 mb-4">
            <h1>Why Choose Healthcare Pro?</h1>
            <p>Everything you need for smart healthcare management</p>
          </div>
          <div className="col-lg-4 col-md-6 text-center mb-4">
            <div className="card p-4 m-2 h-100 feature-card">
              <i className="fa-solid fa-magnifying-glass mb-3 feature-icon"></i>
              <h4 className="mb-3">Smart Symptom Checker</h4>
              <p>AI-powered system maps your symptoms to the right medical specialization instantly</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 text-center mb-4">
            <div className="card p-4 m-2 h-100 feature-card">
              <i className="fa-solid fa-location-dot mb-3 feature-icon"></i>
              <h4 className="mb-3">Find Nearby Doctors</h4>
              <p>Location-based search shows doctors and hospitals closest to you with real-time availability</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 text-center mb-4">
            <div className="card p-4 m-2 h-100 feature-card">
              <i className="fa-regular fa-calendar-check mb-3 feature-icon"></i>
              <h4 className="mb-3">Easy Appointments</h4>
              <p>Book appointments in just 3 clicks. View, reschedule, or cancel anytime from your dashboard</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 text-center mb-4">
            <div className="card p-4 m-2 h-100 feature-card">
              <i className="fa-solid fa-book-medical mb-3 feature-icon"></i>
              <h4 className="mb-3">Digital Medical Records</h4>
              <p>Upload, store, and access all your medical reports securely in one place.</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 text-center mb-4">
            <div className="card p-4 m-2 h-100 feature-card">
              <i className="fa-solid fa-robot mb-3 feature-icon"></i>
              <h4 className="mb-3">AI Report Insights</h4>
              <p>Get simple explanations of medical reports with highlighted abnormal values.</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 text-center mb-4">
            <div className="card p-4 m-2 h-100 feature-card">
              <i className="fa-solid fa-capsules mb-3 feature-icon"></i>
              <h4 className="mb-3">E-Prescriptions</h4>
              <p>Receive and manage digital prescriptions from doctors with complete medication history.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how" className="working container items-center py-5">
        <div className="row mt-5">
          <div className="col-12 text-center mb-5">
            <h2>How it Works</h2>
            <p>Get started in 3 simple steps</p>
          </div>
          <div className="col-lg-4 col-md-4 text-center mb-4">
            <div className="step-number">1</div>
            <h5 className="mt-3">Register</h5>
            <p>Create your account as a patient or doctor in under 2 minutes</p>
          </div>
          <div className="col-lg-4 col-md-4 text-center mb-4">
            <div className="step-number">2</div>
            <h5 className="mt-3">Find & Book</h5>
            <p>Search for doctors by specialization, location, or symptoms</p>
          </div>
          <div className="col-lg-4 col-md-4 text-center mb-4">
            <div className="step-number">3</div>
            <h5 className="mt-3">Manage Health</h5>
            <p>Track appointments, store reports, and follow prescriptions digitally</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="about" className="ready container py-5">
        <div className="row mt-5">
          <div className="col-12 text-center mb-4">
            <h3>Ready to Take Control of your Health?</h3>
            <p>Join thousands of patients and doctors using Healthcare Pro</p>
            <div className="mt-4">
              <button 
                className="btn btn-primary btn-lg me-3"
                onClick={() => navigate('/login')}
              >
                Login to Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div id="contact" className="last container-fluid footer-section">
        <div className="row p-4">
          <div className="col-lg-3 col-md-6 text-center mb-4">
            <h5>HealthCare Pro</h5>
            <p>Smart healthcare for everyone</p>
          </div>
          <div className="col-lg-3 col-md-6 text-center mb-4">
            <h5>Quick Links</h5>
            <p onClick={() => handleFooterLink('about')} style={{ cursor: 'pointer' }}>About Us</p>
            <p onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>Features</p>
            <p onClick={() => handleFooterLink('contact')} style={{ cursor: 'pointer' }}>Contact</p>
          </div>
          <div className="col-lg-3 col-md-6 text-center mb-4">
            <h5>Legal</h5>
            <p onClick={() => handleFooterLink('privacy')} style={{ cursor: 'pointer' }}>Privacy Policy</p>
            <p onClick={() => handleFooterLink('terms')} style={{ cursor: 'pointer' }}>Terms of Service</p>
            <p onClick={() => handleFooterLink('hipaa')} style={{ cursor: 'pointer' }}>HIPAA Compliance</p>
          </div>
          <div className="col-lg-3 col-md-6 text-center mb-4">
            <h5>Support</h5>
            <p onClick={() => handleFooterLink('help')} style={{ cursor: 'pointer' }}>Help Center</p>
            <p onClick={() => handleFooterLink('faq')} style={{ cursor: 'pointer' }}>FAQ</p>
            <p onClick={() => handleFooterLink('contact')} style={{ cursor: 'pointer' }}>Contact Us</p>
          </div>
          <div className="col-12 text-center mt-4">
            <p>© 2024 HealthCare Pro. All rights reserved. | Made with ❤️ for better healthcare</p>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
    </div>
  );
}

export default LandingPage;

