import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
    } else {
      setLoading(true);
      
      try {
        // Check if user is logged in
        if (!user) {
          toast.error('Please login to place an order');
          navigate('/login');
          return;
        }

        const orderData = {
          items: cartItems.map(item => ({
            product: item._id,
            name: item.name,
            brand: item.brand,
            image: item.image || item.images?.[0] || '',
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          },
          paymentMethod: formData.paymentMethod,
          itemsPrice: total,
          shippingPrice: deliveryFee,
          totalPrice: grandTotal
        };

        const response = await orderAPI.create(orderData);
        const order = response.data.data;
        
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-tracking/${order._id}`);
      } catch (error) {
        console.error('Order error:', error);
        const errorMessage = error.response?.data?.message || 'Failed to place order';
        
        if (error.response?.status === 401) {
          toast.error('Please login to place an order');
          navigate('/login');
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const deliveryFee = 99;
  const total = getCartTotal();
  const grandTotal = total + deliveryFee;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        
        <div className="checkout-layout">
          <div className="checkout-form">
            <div className="checkout-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">Delivery Address</span>
              </div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">Payment</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="form-section">
                  <h2>Delivery Address</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    Continue to Payment
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="form-section">
                  <h2>Payment Method</h2>
                  
                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                      />
                      <div className="payment-info">
                        <strong>Cash on Delivery</strong>
                        <p>Pay when you receive your order</p>
                      </div>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                      />
                      <div className="payment-info">
                        <strong>Credit/Debit Card</strong>
                        <p>Pay securely with your card</p>
                      </div>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleChange}
                      />
                      <div className="payment-info">
                        <strong>UPI</strong>
                        <p>Pay using UPI apps</p>
                      </div>
                    </label>
                  </div>

                  <div className="checkout-actions">
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item._id} className="summary-item">
                  <img src={item.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=60&h=80&fit=crop'} alt={item.name} />
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
