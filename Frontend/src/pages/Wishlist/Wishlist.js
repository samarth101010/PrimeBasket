import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import EmptyState from '../../components/EmptyState/EmptyState';
import { FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemove = (itemId, itemName) => {
    removeFromWishlist(itemId);
    toast.success(`${itemName} removed from wishlist`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <EmptyState type="wishlist" />
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 className="page-title">My Wishlist ({wishlistItems.length} items)</h1>
        
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item._id} className="wishlist-item">
              <div className="wishlist-image" onClick={() => navigate(`/product/${item._id}`)}>
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="wishlist-info">
                <h3>{item.brand}</h3>
                <p>{item.name}</p>
                <div className="wishlist-price">
                  <span className="current">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="original">₹{item.originalPrice}</span>
                  )}
                </div>
              </div>

              <div className="wishlist-actions">
                <button 
                  className="btn-primary"
                  onClick={() => handleAddToCart(item)}
                >
                  <FiShoppingBag /> Add to Bag
                </button>
                <button 
                  className="btn-remove"
                  onClick={() => handleRemove(item._id, item.name)}
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
