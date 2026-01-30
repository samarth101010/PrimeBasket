import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { productAPI } from '../../services/api';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiClock, FiTrendingUp } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const response = await productAPI.getAll({ search: searchQuery, limit: 5 });
          setSearchSuggestions(response.data.data);
        } catch (error) {
          console.error('Failed to fetch suggestions');
        }
      } else {
        setSearchSuggestions([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (e, query = searchQuery) => {
    if (e) e.preventDefault();
    const searchTerm = query.trim();
    if (searchTerm) {
      // Save to recent searches
      const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      navigate(`/products?search=${searchTerm}`);
      setSearchQuery('');
      setShowSearchSuggestions(false);
    }
  };

  const handleSearchFocus = () => {
    setShowSearchSuggestions(true);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="header">
      {/* Top Bar with Support */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="support-info">
            <span>📞 Customer Support: <strong>1800-123-4567</strong></span>
          </div>
          <div className="trust-badges">
            <span className="trust-badge">✓ 100% Secure Payment</span>
            <span className="trust-badge">✓ Easy Returns</span>
          </div>
        </div>
      </div>

      <div className="header-container">
        <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          {showMobileMenu ? <FiX /> : <FiMenu />}
        </button>

        <Link to="/" className="logo">
          <img src="/logo.png" alt="PrimeBasket Logo" className="logo-image" />
          <div className="logo-container">
            <span className="logo-prime">Prime</span>
            <span className="logo-basket">Basket</span>
          </div>
        </Link>

        <nav className={`nav-menu ${showMobileMenu ? 'mobile-show' : ''}`}>
          <Link to="/products/men" onClick={() => setShowMobileMenu(false)}>MEN</Link>
          <Link to="/products/women" onClick={() => setShowMobileMenu(false)}>WOMEN</Link>
          <Link to="/products/kids" onClick={() => setShowMobileMenu(false)}>KIDS</Link>
          <Link to="/products/home" onClick={() => setShowMobileMenu(false)}>HOME & LIVING</Link>
          <Link to="/products/beauty" onClick={() => setShowMobileMenu(false)}>BEAUTY</Link>
        </nav>

        <form className="search-bar" onSubmit={handleSearch} ref={searchRef}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
          />
          
          {showSearchSuggestions && (
            <div className="search-suggestions">
              {searchQuery.trim().length > 1 && searchSuggestions.length > 0 && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <FiTrendingUp /> Products
                  </div>
                  {searchSuggestions.map(product => (
                    <div 
                      key={product._id} 
                      className="suggestion-item"
                      onClick={() => {
                        navigate(`/product/${product._id}`);
                        setSearchQuery('');
                        setShowSearchSuggestions(false);
                      }}
                    >
                      <img src={product.images[0]} alt={product.name} />
                      <div className="suggestion-info">
                        <p className="suggestion-name">{product.name}</p>
                        <p className="suggestion-brand">{product.brand}</p>
                        <p className="suggestion-price">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {recentSearches.length > 0 && searchQuery.trim().length === 0 && (
                <div className="suggestions-section">
                  <div className="suggestions-header">
                    <FiClock /> Recent Searches
                    <button 
                      className="clear-btn" 
                      onClick={clearRecentSearches}
                      type="button"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <div 
                      key={index} 
                      className="suggestion-item recent"
                      onClick={() => handleSearch(null, search)}
                    >
                      <FiSearch />
                      <span>{search}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {searchQuery.trim().length > 1 && searchSuggestions.length === 0 && (
                <div className="no-suggestions">
                  No products found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </form>

        <div className="header-actions">
          <div className="action-item" onClick={toggleUserMenu} ref={userMenuRef}>
            <FiUser />
            <span>Profile</span>
            {showUserMenu && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <div className="user-info">
                      <p>Hello, {user.name}</p>
                    </div>
                    <Link to="/profile" onClick={() => setShowUserMenu(false)}>My Profile</Link>
                    <Link to="/orders" onClick={() => setShowUserMenu(false)}>Orders</Link>
                    {isAdmin() && (
                      <Link to="/admin" onClick={() => setShowUserMenu(false)}>Admin Dashboard</Link>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setShowUserMenu(false)}>Login</Link>
                    <Link to="/register" onClick={() => setShowUserMenu(false)}>Register</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/wishlist" className="action-item">
            <FiHeart />
            <span>Wishlist</span>
            {getWishlistCount() > 0 && (
              <span className="cart-badge">{getWishlistCount()}</span>
            )}
          </Link>

          <Link to="/cart" className="action-item">
            <FiShoppingBag />
            <span>Bag</span>
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
