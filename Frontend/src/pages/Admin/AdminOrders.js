import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, orderAPI } from '../../services/api';
import { FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getOrders({ limit: 100 });
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated successfully!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/order-tracking/${orderId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      'Processing': 'status-processing',
      'Confirmed': 'status-confirmed',
      'Shipped': 'status-shipped',
      'Out for Delivery': 'status-transit',
      'Delivered': 'status-delivered',
      'Cancelled': 'status-cancelled'
    };
    return statusMap[status] || '';
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">Manage Orders</h1>
          <div className="stats-summary">
            <span>Total Orders: {orders.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">No orders found</div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>₹{order.totalPrice}</td>
                    <td>
                      <span className={`payment-badge ${order.paymentStatus}`}>
                        {order.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`status-select ${getStatusClass(order.orderStatus)}`}
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <button 
                        className="action-btn view-btn" 
                        onClick={() => handleViewOrder(order._id)}
                        title="View Order Details"
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
