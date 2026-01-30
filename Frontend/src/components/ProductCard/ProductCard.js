import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { FiHeart, FiStar, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import QuickView from '../QuickView/QuickView';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [showQuickView, setShowQuickView] = useState(false);

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const inWishlist = isInWishlist(product._id);

  return (
    <>
      <div className="product-card" onClick={handleClick}>
        <div className="product-image">
          <img src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop'} alt={product.name} />
          {product.stock === 0 && (
            <div className="stock-badge out-of-stock">Out of Stock</div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="stock-badge low-stock">Only {product.stock} left!</div>
          )}
          <button 
            className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
            onClick={handleWishlistClick}
          >
            {inWishlist ? <FaHeart /> : <FiHeart />}
          </button>
          <button className="quick-view-btn" onClick={handleQuickView}>
            <FiEye /> Quick View
          </button>
        </div>
        <div className="product-info">
          <h3 className="product-brand">{product.brand}</h3>
          <p className="product-name">{product.name}</p>
          <div className="product-price">
            <span className="current-price">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="original-price">₹{product.originalPrice}</span>
                <span className="discount">({calculateDiscount()}% OFF)</span>
              </>
            )}
          </div>
          {product.rating && (
            <div className="product-rating">
              <span className="rating-value">
                {product.rating.toFixed(1)} <FiStar />
              </span>
              <span className="rating-count">({product.numReviews || 0})</span>
            </div>
          )}
        </div>
      </div>
      {showQuickView && (
        <QuickView product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};

export default ProductCard;
