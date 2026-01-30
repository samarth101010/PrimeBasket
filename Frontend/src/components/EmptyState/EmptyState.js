import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmptyState.css';

const EmptyState = ({ type = 'cart', onAction }) => {
  const navigate = useNavigate();

  const states = {
    cart: {
      icon: '🛒',
      title: 'Your bag is empty',
      message: 'Add items to get started',
      buttonText: 'Start Shopping',
      action: () => navigate('/products/men')
    },
    wishlist: {
      icon: '💝',
      title: 'Your wishlist is empty',
      message: 'Save your favorite items here',
      buttonText: 'Explore Products',
      action: () => navigate('/products/women')
    },
    search: {
      icon: '🔍',
      title: 'No products found',
      message: 'Try adjusting your search or filters',
      buttonText: 'Clear Filters',
      action: onAction
    },
    orders: {
      icon: '📦',
      title: 'No orders yet',
      message: 'Start shopping to see your orders here',
      buttonText: 'Shop Now',
      action: () => navigate('/products/men')
    }
  };

  const state = states[type] || states.cart;

  return (
    <div className="empty-state">
      <div className="empty-state-icon">{state.icon}</div>
      <h2>{state.title}</h2>
      <p>{state.message}</p>
      <button className="btn-primary" onClick={state.action}>
        {state.buttonText}
      </button>
    </div>
  );
};

export default EmptyState;
