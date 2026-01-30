import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { productAPI, reviewAPI } from '../../services/api';
import useRecentlyViewed from '../../hooks/useRecentlyViewed';
import RecentlyViewed from '../../components/RecentlyViewed/RecentlyViewed';
import ImageZoom from '../../components/ImageZoom/ImageZoom';
import { FiStar, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });

  // Calculate delivery date (3-5 days from now)
  const getDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + Math.floor(Math.random() * 3) + 3);
    return deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getOne(id);
        const productData = response.data.data;
        
        // Define options based on category name
        let optionLabel = 'Size';
        let optionValues = [];
        const categoryName = productData.category?.name?.toLowerCase() || '';
        
        if (categoryName === 'men' || categoryName === 'women') {
          optionLabel = 'Size';
          optionValues = ['S', 'M', 'L', 'XL', 'XXL'];
        } else if (categoryName === 'kids') {
          optionLabel = 'Size';
          optionValues = ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'];
        } else if (categoryName.includes('home')) {
          optionLabel = 'Pack';
          optionValues = ['Single', 'Set of 2', 'Set of 4', 'Set of 6'];
        } else if (categoryName === 'beauty') {
          optionLabel = 'Variant';
          optionValues = ['50ml', '100ml', '150ml', '200ml'];
        }
        
        setProduct({
          ...productData,
          optionLabel,
          sizes: optionValues,
          colors: ['Blue', 'Black', 'White'],
          details: [
            'Material: Premium Quality',
            'Fit: Regular Fit',
            'Wash Care: Machine Wash',
            `Brand: ${productData.brand}`
          ]
        });
        
        setMainImage(productData.images[0]);
      } catch (error) {
        toast.error('Failed to load product');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // Scroll to top when product changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      try {
        const response = await reviewAPI.getProductReviews(id);
        const fetchedReviews = response.data.data || [];
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [id]);

  // Add to recently viewed
  useEffect(() => {
    if (product && product._id) {
      addToRecentlyViewed({
        _id: product._id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        rating: product.rating,
        numReviews: product.numReviews || product.reviews,
        stock: product.stock
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id]);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Sorry, this product is out of stock!');
      return;
    }
    if (!selectedSize && product.sizes.length > 0) {
      toast.warning(`Please select a ${product.optionLabel.toLowerCase()}`);
      return;
    }
    // Add image property for cart display
    const productForCart = {
      ...product,
      image: product.images[0]
    };
    addToCart(productForCart, quantity);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      toast.error('Sorry, this product is out of stock!');
      return;
    }
    if (!selectedSize && product.sizes.length > 0) {
      toast.warning(`Please select a ${product.optionLabel.toLowerCase()}`);
      return;
    }
    const productForCart = {
      ...product,
      image: product.images[0]
    };
    addToCart(productForCart, quantity);
    navigate('/cart');
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast.warning('Please write a comment');
      return;
    }

    try {
      const response = await reviewAPI.create({
        product: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });

      toast.success('Review submitted successfully!');
      
      // Add new review to the list
      setReviews([response.data.data, ...reviews]);
      
      // Reset form
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);

      // Refresh product to update rating
      const productResponse = await productAPI.getOne(id);
      const productData = productResponse.data.data;
      setProduct(prev => ({
        ...prev,
        rating: productData.rating,
        numReviews: productData.numReviews
      }));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to submit review';
      toast.error(errorMsg);
    }
  };

  // Format date for reviews
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="loading-state">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="error-state">Product not found</div>
        </div>
      </div>
    );
  }

  const categoryName = product.category?.name || product.category || 'Products';

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
          <span className="breadcrumb-separator">/</span>
          <span onClick={() => navigate(`/products/${categoryName.toLowerCase()}`)} className="breadcrumb-link">
            {categoryName}
          </span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        <div className="product-layout">
          <div className="product-images">
            <div className="image-thumbnails">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Product ${index + 1}`}
                  className={mainImage === img ? 'active' : ''}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
            <div className="main-image">
              <ImageZoom src={mainImage} alt={product.name} />
            </div>
          </div>

          <div className="product-details">
            <h1 className="product-brand">{product.brand}</h1>
            <h2 className="product-name">{product.name}</h2>
            
            <div className="product-rating">
              <span className="rating-badge">
                {product.rating.toFixed(1)} <FiStar />
              </span>
              <span className="rating-text">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            <div className="product-price">
              <span className="current-price">₹{product.price}</span>
              <span className="original-price">₹{product.originalPrice}</span>
              <span className="discount">
                ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
              </span>
            </div>

            {product.stock === 0 && (
              <div className="out-of-stock-banner">
                <span className="out-of-stock-text">⚠️ OUT OF STOCK</span>
              </div>
            )}

            {product.stock > 0 && product.stock <= 5 && (
              <div className="low-stock-banner">
                <span className="low-stock-text">⚡ Only {product.stock} left in stock - Order soon!</span>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selector">
                <div className="size-header">
                  <h3>Select {product.optionLabel}</h3>
                  {(categoryName.toLowerCase() === 'men' || categoryName.toLowerCase() === 'women' || categoryName.toLowerCase() === 'kids') && (
                    <button className="size-guide-btn" onClick={() => setShowSizeGuide(true)}>
                      Size Guide
                    </button>
                  )}
                </div>
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

            {product.stock > 0 && (
              <div className="delivery-info">
                <h3>Delivery Options</h3>
                <p className="delivery-date">
                  <strong>Delivers by {getDeliveryDate()}</strong>
                </p>
                <p className="delivery-note">Free delivery on orders above ₹999</p>
                <p className="cod-available">Cash on Delivery available</p>
              </div>
            )}

            <div className="trust-signals">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span>100% Secure Payment</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">↩️</span>
                <span>Easy 30-Day Returns</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Genuine Products</span>
              </div>
            </div>

            <div className="quantity-selector">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn-primary" 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{ opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
              >
                <FiShoppingBag /> {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>
              <button 
                className="btn-secondary" 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                style={{ opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
              </button>
              <button className="wishlist-btn">
                <FiHeart />
              </button>
            </div>

            <div className="product-info">
              <h3>Product Details</h3>
              <p>{product.description}</p>
              <ul>
                {product.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews ({reviews.length})</h2>
            {user && (
              <button 
                className="write-review-btn" 
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="review-form-container">
              <h3>Share Your Experience</h3>
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="form-group">
                  <label>Rating</label>
                  <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`star ${reviewForm.rating >= star ? 'active' : ''}`}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Tell us what you think about this product..."
                    rows="4"
                    required
                  />
                </div>
                <button type="submit" className="submit-review-btn">
                  Submit Review
                </button>
              </form>
            </div>
          )}

          <div className="reviews-summary">
            <div className="average-rating">
              <span className="rating-number">{product.rating.toFixed(1)}</span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} style={{ color: star <= Math.round(product.rating) ? '#ffa500' : '#d4d5d9' }}>
                    ★
                  </span>
                ))}
              </div>
              <span className="total-reviews">{reviews.length} {reviews.length === 1 ? 'rating' : 'ratings'}</span>
            </div>
          </div>

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="review-user-info">
                      <span className="review-user">{review.user?.name || 'Anonymous'}</span>
                      {review.isVerifiedPurchase && <span className="verified-badge">✓ Verified Purchase</span>}
                    </div>
                    <span className="review-rating">
                      {review.rating} <FiStar />
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <span className="review-date">{formatDate(review.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {showSizeGuide && (
          <div className="size-guide-modal" onClick={() => setShowSizeGuide(false)}>
            <div className="size-guide-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowSizeGuide(false)}>×</button>
              <h2>Size Guide</h2>
              <table className="size-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (inches)</th>
                    <th>Waist (inches)</th>
                    <th>Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>S</td>
                    <td>36-38</td>
                    <td>28-30</td>
                    <td>27</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>38-40</td>
                    <td>30-32</td>
                    <td>28</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>40-42</td>
                    <td>32-34</td>
                    <td>29</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>42-44</td>
                    <td>34-36</td>
                    <td>30</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>44-46</td>
                    <td>36-38</td>
                    <td>31</td>
                  </tr>
                </tbody>
              </table>
              <p className="size-note">Note: All measurements are approximate and may vary by 0.5-1 inch.</p>
            </div>
          </div>
        )}
      </div>

      <RecentlyViewed products={recentlyViewed.filter(p => p._id !== product._id)} />
    </div>
  );
};

export default ProductDetail;
