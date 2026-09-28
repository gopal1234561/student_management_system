import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand-block">
          <div className="footer-brand">
            <span className="footer-logo" aria-hidden="true">
              <svg viewBox="0 0 40 40" role="img">
                <rect x="2" y="2" width="36" height="36" rx="11" fill="currentColor" opacity=".12"/>
                <path d="M10 14 20 9l10 5-10 5-10-5Zm3 4.8v6.7c4.2 2.3 9.8 2.3 14 0v-6.7L20 22l-7-3.2Z" fill="currentColor"/>
                <path d="M30 16v7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </span>
            <span>
              <strong>Student Management</strong>
              <small>Academic administration made simple.</small>
            </span>
          </div>
        </div>

        <div className="footer-column">
          <span className="footer-heading">Platform</span>
          <a href="/students">Students</a>
          <a href="/add-student">Add Student</a>
          <a href="/Enroll">Track Enrollment</a>
        </div>

        <div className="footer-column">
          <span className="footer-heading">Academics</span>
          <a href="/courses">Subjects</a>
          <a href="/course-enrollment">Enroll Student</a>
          <a href="/enrollment-history">Enrollment History</a>
        </div>

        <div className="footer-column footer-contact-column">
          <span className="footer-heading">Connect</span>
          <a href="mailto:studentinfo@example.com"><span className="footer-mini-icon">✉</span> studentinfo@example.com</a>
          <span className="footer-status"><i></i> System ready</span>
          <div className="footer-socials">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">𝕏</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#support">Support</a>
        </div>
        <div className="footer-text">
          © 2025 Student Management built with <span className="footer-heart" aria-label="love">♥</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
