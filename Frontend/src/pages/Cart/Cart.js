import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import EmptyState from '../../components/EmptyState/EmptyState';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <EmptyState type="cart" />
        </div>
      </div>
    );
  }

  const handleRemove = (itemId, itemName) => {
    removeFromCart(itemId);
    toast.success(`${itemName} removed from cart`);
  };

  const deliveryFee = 99;
  const total = getCartTotal();
  const grandTotal = total + deliveryFee;

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Bag ({cartItems.length} items)</h1>
        
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=200&fit=crop'} alt={item.name} />
                
                <div className="item-details">
                  <h3>{item.brand}</h3>
                  <p>{item.name}</p>
                  <div className="item-price">
                    <span className="current">₹{item.price}</span>
                    {item.originalPrice && (
                      <span className="original">₹{item.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="item-actions">
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemove(item._id, item.name)}
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Price Details</h3>
            <div className="summary-row">
              <span>Total MRP</span>
              <span>₹{total}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{grandTotal}</span>
            </div>
            <button 
              className="btn-primary checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
