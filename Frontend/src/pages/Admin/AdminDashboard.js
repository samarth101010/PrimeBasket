import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to load statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading-state">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const statsCards = [
    { icon: <FiDollarSign />, label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, color: '#4caf50' },
    { icon: <FiShoppingBag />, label: 'Total Orders', value: stats?.totalOrders || 0, color: '#2196f3' },
    { icon: <FiPackage />, label: 'Total Products', value: stats?.totalProducts || 0, color: '#ff9800' },
    { icon: <FiUsers />, label: 'Total Users', value: stats?.totalUsers || 0, color: '#9c27b0' }
  ];

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <div className="admin-nav">
            <Link to="/admin/products" className="admin-nav-link">Products</Link>
            <Link to="/admin/orders" className="admin-nav-link">Orders</Link>
            <Link to="/admin/users" className="admin-nav-link">Users</Link>
            <Link to="/admin/coupons" className="admin-nav-link">Coupons</Link>
          </div>
        </div>

        <div className="stats-grid">
          {statsCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ background: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <p className="stat-label">{stat.label}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2>Recent Orders</h2>
            {stats?.recentOrders?.length > 0 ? (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map(order => (
                      <tr key={order._id}>
                        <td>#{order._id.slice(-8).toUpperCase()}</td>
                        <td>{order.user?.name || 'N/A'}</td>
                        <td>₹{order.totalPrice}</td>
                        <td>
                          <span className={`status-badge status-${order.orderStatus.toLowerCase().replace(' ', '-')}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">No orders yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
