import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">My Profile</h1>

        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <img 
                src="/images/profile.jpg" 
                alt="Profile" 
                className="profile-photo"
              />
            </div>
            <h2>{user?.name || 'Samarth Lipane'}</h2>
            <p>{user?.email || '2203051050794@paruluniversity.ac.in'}</p>
            <span className="user-badge">{user?.role === 'admin' ? 'Admin' : 'Customer'}</span>
          </div>

          <div className="profile-content">
            <div className="profile-section">
              <div className="section-header">
                <h3>Personal Information</h3>
                {!isEditing ? (
                  <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                ) : (
                  <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="profile-info">
                  <div className="info-item">
                    <FiUser className="info-icon" />
                    <div>
                      <label>Full Name</label>
                      <p>{formData.name || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <FiMail className="info-icon" />
                    <div>
                      <label>Email</label>
                      <p>{formData.email}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <FiPhone className="info-icon" />
                    <div>
                      <label>Phone</label>
                      <p>{formData.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <FiMapPin className="info-icon" />
                    <div>
                      <label>Address</label>
                      <p>{formData.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
