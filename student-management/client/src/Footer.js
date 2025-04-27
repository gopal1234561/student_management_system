
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-contact">
          <p><strong>Contact Us</strong></p>
          <p><i className="fas fa-envelope"></i> studentinfo@example.com</p>
          <p><i className="fas fa-phone"></i> +123 76513xxx23</p>
        </div>

        <div className="footer-socials">
       
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-links">
        <a href="#privacy"><i className="fas fa-shield-alt"></i> Privacy</a>
        <a href="#terms"><i className="fas fa-gavel"></i> Terms</a>
        <a href="#support"><i className="fas fa-life-ring"></i> Support</a>
      </div>

      <div className="footer-text">
        © {new Date().getFullYear()} Student Management. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
