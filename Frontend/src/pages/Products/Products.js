import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductSkeleton from '../../components/ProductSkeleton/ProductSkeleton';
import Pagination from '../../components/Pagination/Pagination';
import EmptyState from '../../components/EmptyState/EmptyState';
import { FiFilter, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Products.css';

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const searchQuery = searchParams.get('search') || '';
  const brandQuery = searchParams.get('brand') || '';

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      // Use category from URL parameter if available
      if (category) {
        // Find category ID by slug/name
        const cat = categories.find(c => c.slug === category || c.name.toLowerCase() === category.toLowerCase());
        if (cat) {
          params.category = cat._id;
        }
      }

      if (selectedPriceRange) {
        const [min, max] = selectedPriceRange.split('-');
        if (min) params.minPrice = min;
        if (max && max !== '') params.maxPrice = max;
      }

      if (selectedBrands.length > 0) {
        params.brand = selectedBrands[0]; // API supports single brand for now
      }

      if (selectedRating) {
        params.rating = selectedRating;
      }

      if (selectedDiscount) {
        params.discount = selectedDiscount;
      }

      const response = await productAPI.getAll(params);
      setProducts(response.data.data);
      setTotalPages(response.data.pages);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set brand from URL parameter
  useEffect(() => {
    if (brandQuery && !selectedBrands.includes(brandQuery)) {
      setSelectedBrands([brandQuery]);
    } else if (!brandQuery && selectedBrands.length > 0) {
      setSelectedBrands([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandQuery]);

  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, category, selectedPriceRange, selectedBrands, selectedRating, selectedDiscount, sortBy, categories]);

  // Scroll to top when category or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, currentPage]);

  const handlePriceChange = (range) => {
    setSelectedPriceRange(range);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
    setCurrentPage(1);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  const handleDiscountChange = (discount) => {
    setSelectedDiscount(discount);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categorySlug) => {
    setCurrentPage(1);
    navigate(`/products/${categorySlug}`);
  };

  const clearFilters = () => {
    setSelectedPriceRange('');
    setSelectedBrands([]);
    setSelectedRating('');
    setSelectedDiscount('');
    setCurrentPage(1);
    navigate('/products');
  };

  const hasActiveFilters = selectedPriceRange || selectedBrands.length > 0 || selectedRating || selectedDiscount || category;

  const availableBrands = ['Roadster', 'Levis', 'H&M', 'Zara', 'Nike', 'Adidas', 'Puma', 'Raymond', 'US Polo', 'Van Heusen'];

  return (
    <div className="products-page">
      <div className="container">
        <div className="products-header">
          <div className="header-left">
            <h1>
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : category 
                  ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
                  : 'All Products'}
            </h1>
            <p className="results-count">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>
          <div className="header-right">
            <button 
              className="filter-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
            </button>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="products-layout">
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                <FiX />
              </button>
            </div>

            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            )}

            <div className="filter-section">
              <h4>Categories</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={!category}
                    onChange={() => {
                      navigate('/products');
                      setCurrentPage(1);
                    }}
                  />
                  <span>All Products</span>
                </label>
                {categories.map(cat => (
                  <label key={cat._id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={category === cat.slug}
                      onChange={() => handleCategoryChange(cat.slug)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === '0-500'}
                    onChange={() => handlePriceChange('0-500')}
                  />
                  <span>Under ₹500</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === '500-1000'}
                    onChange={() => handlePriceChange('500-1000')}
                  />
                  <span>₹500 - ₹1000</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === '1000-2000'}
                    onChange={() => handlePriceChange('1000-2000')}
                  />
                  <span>₹1000 - ₹2000</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === '2000-5000'}
                    onChange={() => handlePriceChange('2000-5000')}
                  />
                  <span>₹2000 - ₹5000</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === '5000-'}
                    onChange={() => handlePriceChange('5000-')}
                  />
                  <span>Above ₹5000</span>
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h4>Brand</h4>
              <div className="filter-options">
                {availableBrands.map(brand => (
                  <label key={brand} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Customer Ratings</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === '4'}
                    onChange={() => handleRatingChange('4')}
                  />
                  <span>4★ & above</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === '3'}
                    onChange={() => handleRatingChange('3')}
                  />
                  <span>3★ & above</span>
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h4>Discount</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="discount"
                    checked={selectedDiscount === '50'}
                    onChange={() => handleDiscountChange('50')}
                  />
                  <span>50% or more</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="discount"
                    checked={selectedDiscount === '40'}
                    onChange={() => handleDiscountChange('40')}
                  />
                  <span>40% or more</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="discount"
                    checked={selectedDiscount === '30'}
                    onChange={() => handleDiscountChange('30')}
                  />
                  <span>30% or more</span>
                </label>
              </div>
            </div>
          </aside>

          <main className="products-main">
            {loading ? (
              <div className="products-grid">
                {[...Array(12)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No products found"
                message="Try adjusting your filters or search query"
                actionText="Clear Filters"
                onAction={clearFilters}
              />
            ) : (
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {showFilters && (
        <div 
          className="filters-overlay"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default Products;
