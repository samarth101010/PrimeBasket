import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './RecentlyViewed.css';

const RecentlyViewed = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="recently-viewed-section">
      <div className="container">
        <h2 className="section-title">Recently Viewed</h2>
        <div className="recently-viewed-grid">
          {products.slice(0, 6).map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
