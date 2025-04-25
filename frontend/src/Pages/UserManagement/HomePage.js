import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const images = [
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
];

const WelcomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-container">
      {/* Full-screen Slideshow */}
      <div className="fullscreen-slideshow">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`slide ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="slide-overlay"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="welcome-content">
        <header className="welcome-header">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span className="logo-text">SkillsHub</span>
          </div>
        </header>

        <main className="welcome-main">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to SkillsHub</h1>
            <p className="hero-subtitle">
              Your gateway to knowledge and professional growth. 
              Access courses, connect with experts, and advance your career.
            </p>
            
            <div className="cta-buttons">
              <Link to="/login" className="cta-button login-button">
                Login
              </Link>
              <Link to="/register" className="cta-button signup-button">
                Sign Up
              </Link>
            </div>
          </div>
        </main>

        <footer className="welcome-footer">
          <p>© {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </footer>
      </div>

      {/* Slideshow Dots */}
      <div className="slideshow-dots">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(idx)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;