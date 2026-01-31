import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { productAPI } from '../../services/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productAPI.getAll({ limit: 8, sort: 'rating' });
        // Filter only in-stock products and take first 4
        const inStockProducts = response.data.data.filter(p => p.stock > 0).slice(0, 4);
        setFeaturedProducts(inStockProducts);
      } catch (error) {
        console.error('Failed to load featured products');
      }
    };
    fetchFeaturedProducts();
  }, []);

  const categories = [
    { id: 1, name: 'Men', image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop', path: '/products/men' },
    { id: 2, name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop', path: '/products/women' },
    { id: 3, name: 'Kids', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=500&fit=crop', path: '/products/kids' },
    { id: 4, name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop', path: '/products/beauty' }
  ];

  return (
    <div className="home">
      {/* Promotional Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <span className="promo-icon">🎉</span>
          <span className="promo-text">
            <strong>MEGA SALE!</strong> Get up to 70% OFF on Fashion & Lifestyle | Use code: <strong>PRIME70</strong>
          </span>
          <span className="promo-timer">⏰ Ends in 2 days</span>
        </div>
      </div>

      <div className="hero-banner">
        <div className="hero-content">
          <img src="/logo.png" alt="PrimeBasket Logo" className="hero-logo" />
          <h1>Welcome to PrimeBasket</h1>
          <p>Your Premium Fashion Destination</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Explore Now
          </button>
        </div>
      </div>

      <div className="deals-banner">
        <div className="container-fluid">
          <h2 className="section-title">DEALS OF THE DAY</h2>
          <div className="deals-grid">
            <div className="deal-card" onClick={() => navigate('/products/men')}>
              <img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop" alt="Men's Fashion" />
              <div className="deal-overlay">
                <h3>Men's Collection</h3>
                <p>Up to 70% OFF</p>
              </div>
            </div>
            <div className="deal-card" onClick={() => navigate('/products/women')}>
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop" alt="Women's Fashion" />
              <div className="deal-overlay">
                <h3>Women's Collection</h3>
                <p>Up to 60% OFF</p>
              </div>
            </div>
            <div className="deal-card" onClick={() => navigate('/products/kids')}>
              <img src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=500&fit=crop" alt="Kids Fashion" />
              <div className="deal-overlay">
                <h3>Kids Collection</h3>
                <p>Up to 50% OFF</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="categories-section">
        <h2 className="section-title">SHOP BY CATEGORY</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => navigate(category.path)}
            >
              <img src={category.image} alt={category.name} />
              <div className="category-overlay">
                <h3>{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="featured-products">
        <h2 className="section-title">TRENDING NOW</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      <div className="brands-section">
        <h2 className="section-title">TOP BRANDS</h2>
        <div className="brands-grid">
          <div className="brand-card" onClick={() => navigate('/products?brand=H%26M')}>H&M</div>
          <div className="brand-card" onClick={() => navigate('/products?brand=Nike')}>Nike</div>
          <div className="brand-card" onClick={() => navigate('/products?brand=Levis')}>Levis</div>
          <div className="brand-card" onClick={() => navigate('/products?brand=Zara')}>Zara</div>
          <div className="brand-card" onClick={() => navigate('/products?brand=Puma')}>Puma</div>
          <div className="brand-card" onClick={() => navigate('/products?brand=Roadster')}>Roadster</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
