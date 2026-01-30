import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './OrderTracking.css';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOne(orderId);
      setOrder(response.data.data);
    } catch (error) {
      toast.error('Order not found');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking-page">
        <div className="container">
          <h1 className="page-title">Order Not Found</h1>
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            The order you're looking for doesn't exist.
          </p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="btn-primary" onClick={() => navigate('/orders')}>
              View All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getTrackingSteps = () => {
    const baseSteps = [
      { status: 'Order Placed', date: new Date(order.createdAt).toLocaleString(), completed: true },
      { status: 'Order Confirmed', date: new Date(new Date(order.createdAt).getTime() + 30 * 60000).toLocaleString(), completed: true }
    ];

    if (order.orderStatus === 'Processing') {
      return [
        ...baseSteps,
        { status: 'Processing', date: 'In progress', completed: false },
        { status: 'Shipped', date: 'Pending', completed: false },
        { status: 'Out for Delivery', date: 'Pending', completed: false },
        { status: 'Delivered', date: 'Pending', completed: false }
      ];
    } else if (order.orderStatus === 'Shipped' || order.orderStatus === 'In Transit') {
      return [
        ...baseSteps,
        { status: 'Shipped', date: new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60000).toLocaleString(), completed: true },
        { status: 'Out for Delivery', date: 'Expected today', completed: false },
        { status: 'Delivered', date: 'Pending', completed: false }
      ];
    } else if (order.orderStatus === 'Delivered') {
      return [
        ...baseSteps,
        { status: 'Shipped', date: new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60000).toLocaleString(), completed: true },
        { status: 'Out for Delivery', date: new Date(new Date(order.createdAt).getTime() + 48 * 60 * 60000).toLocaleString(), completed: true },
        { status: 'Delivered', date: order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'Delivered', completed: true }
      ];
    }

    return baseSteps;
  };

  const tracking = getTrackingSteps();

  const getTrackingIcon = (index) => {
    switch (index) {
      case 0:
        return <FiCheckCircle />;
      case 1:
        return <FiPackage />;
      case 2:
        return <FiTruck />;
      case 3:
        return <FiTruck />;
      case 4:
        return <FiHome />;
      default:
        return <FiCheckCircle />;
    }
  };

  return (
    <div className="order-tracking-page">
      <div className="container">
        <h1 className="page-title">Track Order</h1>

        <div className="tracking-layout">
          <div className="tracking-info">
            <div className="order-summary-card">
              <h2>Order #{order.orderNumber || order._id}</h2>
              <p className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              
              <div className="delivery-address">
                <h3>Delivery Address</h3>
                <p>
                  {order.shippingAddress.fullName}<br />
                  {order.shippingAddress.phone}<br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>

              <div className="payment-method">
                <h3>Payment Method</h3>
                <p>
                  {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                  {order.paymentMethod === 'card' && 'Credit/Debit Card'}
                  {order.paymentMethod === 'upi' && 'UPI'}
                </p>
              </div>

              <div className="order-items-list">
                <h3>Items ({order.items.length})</h3>
                {order.items.map((item, index) => (
                  <div key={index} className="tracking-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.brand}</h4>
                      <p>{item.name}</p>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="order-total-section">
                <span>Total Amount</span>
                <strong>₹{order.totalPrice}</strong>
              </div>
            </div>
          </div>

          <div className="tracking-timeline">
            <h2>Order Status</h2>
            <div className="timeline">
              {tracking.map((track, index) => (
                <div 
                  key={index} 
                  className={`timeline-item ${track.completed ? 'completed' : ''}`}
                >
                  <div className="timeline-icon">
                    {getTrackingIcon(index)}
                  </div>
                  <div className="timeline-content">
                    <h3>{track.status}</h3>
                    <p>{track.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
