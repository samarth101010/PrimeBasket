import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="wave-fill"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="wave-fill"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="wave-fill"></path>
        </svg>
      </div>

      <div className="footer-content">
        <div className="footer-container">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <img src="/logo.png" alt="PrimeBasket" />
              <div>
                <span className="logo-prime">Prime</span>
                <span className="logo-basket">Basket</span>
              </div>
            </div>
            <p className="footer-tagline">Your Premium Fashion Destination</p>
            <div className="contact-info">
              <div className="contact-item">
                <FiPhone />
                <span>+91 1800-123-4567</span>
              </div>
              <div className="contact-item">
                <FiMail />
                <span>support@primebasket.com</span>
              </div>
              <div className="contact-item">
                <FiMapPin />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3>SHOP</h3>
            <Link to="/products/men">Men's Fashion</Link>
            <Link to="/products/women">Women's Fashion</Link>
            <Link to="/products/kids">Kids Collection</Link>
            <Link to="/products/home">Home & Living</Link>
            <Link to="/products/beauty">Beauty Products</Link>
          </div>

          <div className="footer-section">
            <h3>HELP</h3>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/shipping">Shipping Info</Link>
            <Link to="/returns">Returns & Exchange</Link>
            <Link to="/track">Track Order</Link>
          </div>

          <div className="footer-section">
            <h3>COMPANY</h3>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>

          <div className="footer-section footer-newsletter">
            <h3>NEWSLETTER</h3>
            <p>Subscribe to get special offers and updates</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FiFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FiTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FiInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FiYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-left">
            <p>&copy; 2024 PrimeBasket. All rights reserved.</p>
            <p className="footer-heart">Made with <span className="heart">❤️</span> for fashion lovers</p>
          </div>
          <div className="payment-methods">
            <span className="payment-label">We Accept:</span>
            <div className="payment-icons">
              <span className="payment-icon">💳 Visa</span>
              <span className="payment-icon">💳 Mastercard</span>
              <span className="payment-icon">📱 UPI</span>
              <span className="payment-icon">💰 Paytm</span>
              <span className="payment-icon">💵 COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
