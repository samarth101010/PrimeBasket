import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiShoppingBag } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/logo.png" alt="PrimeBasket" />
            <div className="logo-text">
              <span className="logo-prime">Prime</span>
              <span className="logo-basket">Basket</span>
            </div>
          </div>
          <h1>Welcome Back!</h1>
          <p className="auth-subtitle">Login to continue your shopping journey</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
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

            <div className="form-footer">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-primary auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-switch">
            New to PrimeBasket? <Link to="/register">Create Account</Link>
          </p>

          <div className="auth-demo-info">
            <p><strong>Demo Credentials:</strong></p>
            <p>User: any email | Admin: admin@test.com</p>
            <p>Password: any password</p>
          </div>
        </div>

        <div className="auth-banner">
          <div className="banner-content">
            <FiShoppingBag className="banner-icon" />
            <h2>Shop the Latest Trends</h2>
            <p>Discover amazing fashion deals and exclusive collections at PrimeBasket</p>
            <div className="banner-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Free Delivery on orders above ₹999</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Easy 30-Day Returns</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>100% Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
