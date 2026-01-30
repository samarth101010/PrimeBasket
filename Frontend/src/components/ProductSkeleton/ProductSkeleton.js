import React from 'react';
import './ProductSkeleton.css';

const ProductSkeleton = () => {
  return (
    <div className="product-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-brand"></div>
        <div className="skeleton-line skeleton-name"></div>
        <div className="skeleton-line skeleton-price"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
