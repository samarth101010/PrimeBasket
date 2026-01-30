import React, { useState, useEffect } from 'react';
import { couponAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiPercent, FiDollarSign } from 'react-icons/fi';
import './Admin.css';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: '',
    isActive: true
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponAPI.getAll();
      setCoupons(response.data.data);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        await couponAPI.update(editingCoupon._id, formData);
        toast.success('Coupon updated successfully');
      } else {
        await couponAPI.create(formData);
        toast.success('Coupon created successfully');
      }
      fetchCoupons();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await couponAPI.delete(id);
        toast.success('Coupon deleted successfully');
        fetchCoupons();
      } catch (error) {
        toast.error('Failed to delete coupon');
      }
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || '',
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      usageLimit: coupon.usageLimit || '',
      validFrom: coupon.validFrom?.split('T')[0] || '',
      validUntil: coupon.validUntil?.split('T')[0] || '',
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      validFrom: '',
      validUntil: '',
      isActive: true
    });
  };

  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

  if (loading) {
    return <div className="admin-loading">Loading coupons...</div>;
  }

  return (
    <div className="admin-coupons">
      <div className="admin-header">
        <div>
          <h1>Coupon Management</h1>
          <p>Create and manage discount coupons</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <FiPlus /> Create Coupon
        </button>
      </div>

      <div className="coupons-stats">
        <div className="stat-card">
          <h3>Total Coupons</h3>
          <p className="stat-value">{coupons.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Coupons</h3>
          <p className="stat-value">{coupons.filter(c => c.isActive && !isExpired(c.validUntil)).length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Usage</h3>
          <p className="stat-value">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</p>
        </div>
      </div>

      <div className="coupons-grid">
        {coupons.map(coupon => (
          <div key={coupon._id} className={`coupon-card ${!coupon.isActive || isExpired(coupon.validUntil) ? 'inactive' : ''}`}>
            <div className="coupon-header">
              <div className="coupon-code">
                {coupon.discountType === 'percentage' ? <FiPercent /> : <FiDollarSign />}
                <span>{coupon.code}</span>
              </div>
              <div className="coupon-actions">
                <button onClick={() => handleEdit(coupon)} className="btn-icon">
                  <FiEdit2 />
                </button>
                <button onClick={() => handleDelete(coupon._id)} className="btn-icon delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <p className="coupon-description">{coupon.description}</p>

            <div className="coupon-details">
              <div className="detail-item">
                <span className="label">Discount:</span>
                <span className="value">
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}%` 
                    : `₹${coupon.discountValue}`}
                </span>
              </div>
              {coupon.minOrderAmount > 0 && (
                <div className="detail-item">
                  <span className="label">Min Order:</span>
                  <span className="value">₹{coupon.minOrderAmount}</span>
                </div>
              )}
              {coupon.maxDiscountAmount && (
                <div className="detail-item">
                  <span className="label">Max Discount:</span>
                  <span className="value">₹{coupon.maxDiscountAmount}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="label">Valid Until:</span>
                <span className="value">{new Date(coupon.validUntil).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Usage:</span>
                <span className="value">
                  {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                </span>
              </div>
            </div>

            <div className="coupon-status">
              {!coupon.isActive ? (
                <span className="status-badge inactive">Inactive</span>
              ) : isExpired(coupon.validUntil) ? (
                <span className="status-badge expired">Expired</span>
              ) : (
                <span className="status-badge active">Active</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && (
        <div className="empty-state">
          <p>No coupons created yet</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            Create Your First Coupon
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="coupon-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., WELCOME10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., 10% off on first order"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? '10' : '200'}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Min Order Amount</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="500"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Discount Amount</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    placeholder="200"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="100"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valid From *</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Valid Until *</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
