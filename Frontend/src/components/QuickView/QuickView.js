import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiStar, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import './QuickView.css';

const QuickView = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Sorry, this product is out of stock!');
      return;
    }
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.warning('Please select a size');
      return;
    }
    addToCart({ ...product, image: product.image }, quantity);
    toast.success('Added to cart!');
    onClose();
  };

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
    onClose();
  };

  return (
    <div className="quick-view-overlay" onClick={onClose}>
      <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quick-view-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="quick-view-content">
          <div className="quick-view-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="quick-view-details">
            <h3 className="quick-view-brand">{product.brand}</h3>
            <h2 className="quick-view-name">{product.name}</h2>

            <div className="quick-view-rating">
              <span className="rating-badge">
                {product.rating.toFixed(1)} <FiStar />
              </span>
              <span className="rating-text">{product.reviews} Reviews</span>
            </div>

            <div className="quick-view-price">
              <span className="current-price">₹{product.price}</span>
              <span className="original-price">₹{product.originalPrice}</span>
              <span className="discount">
                ({product.discount}% OFF)
              </span>
            </div>

            {product.stock === 0 && (
              <div className="stock-badge out-of-stock">Out of Stock</div>
            )}

            {product.stock > 0 && product.stock <= 5 && (
              <div className="stock-badge low-stock">Only {product.stock} left!</div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="quick-view-sizes">
                <h4>Select Size</h4>
                <div className="sizes">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="quick-view-quantity">
              <h4>Quantity</h4>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="quick-view-actions">
              <button 
                className="btn-primary" 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FiShoppingBag /> Add to Bag
              </button>
              <button className="btn-secondary" onClick={handleViewDetails}>
                View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
