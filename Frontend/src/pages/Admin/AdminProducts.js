import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    category: '',
    stock: '',
    images: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({ limit: 100 });
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group products by category
  const groupedProducts = categories.reduce((acc, category) => {
    acc[category._id] = {
      name: category.name,
      products: products.filter(p => p.category?._id === category._id || p.category === category._id)
    };
    return acc;
  }, {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Generate random rating and reviews for new products
      const randomRating = parseFloat((4.0 + (Math.random() * 0.5)).toFixed(1)); // 4.0-4.5
      const randomReviews = Math.floor(Math.random() * 50) + 10; // 10-60
      
      const productData = {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        discount: parseFloat(formData.discount),
        category: formData.category,
        stock: parseInt(formData.stock),
        images: formData.images.split(',').map(img => img.trim()),
        rating: editingProduct ? editingProduct.rating : randomRating,
        numReviews: editingProduct ? editingProduct.numReviews : randomReviews
      };

      console.log('Sending product data:', productData); // Debug log

      if (editingProduct) {
        await productAPI.update(editingProduct._id, productData);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.create(productData);
        toast.success(`Product added successfully with ${randomRating}⭐ rating and ${randomReviews} reviews!`);
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        description: '',
        price: '',
        originalPrice: '',
        discount: '',
        category: '',
        stock: '',
        images: ''
      });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      category: product.category._id || product.category,
      stock: product.stock,
      images: product.images.join(', ')
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        toast.success('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      description: '',
      price: '',
      originalPrice: '',
      discount: '',
      category: '',
      stock: '',
      images: ''
    });
    setShowModal(true);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">Manage Products</h1>
          <button className="btn-primary" onClick={handleAddNew}>
            <FiPlus /> Add Product
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : (
          <>
            {categories.map(category => {
              const categoryProducts = groupedProducts[category._id]?.products || [];
              
              if (categoryProducts.length === 0) return null;
              
              return (
                <div key={category._id} className="category-section">
                  <h2 className="category-title">
                    {category.name} ({categoryProducts.length} products)
                  </h2>
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Brand</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryProducts.map(product => (
                          <tr key={product._id}>
                            <td>
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.brand}</td>
                            <td>₹{product.price}</td>
                            <td>
                              <span className={product.stock === 0 ? 'stock-out' : product.stock <= 5 ? 'stock-low' : 'stock-ok'}>
                                {product.stock}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button className="action-btn edit-btn" onClick={() => handleEdit(product)}>
                                  <FiEdit2 />
                                </button>
                                <button className="action-btn delete-btn" onClick={() => handleDelete(product._id)}>
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Casual Cotton Shirt"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Brand *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="e.g., Nike, Zara, H&M"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    placeholder="Describe the product features, material, fit, etc."
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="e.g., 799"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Original Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                      placeholder="e.g., 1599"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Discount (%) *</label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                      placeholder="e.g., 50"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category * (Select where this product belongs)</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                      style={{ fontSize: '14px', fontWeight: '500' }}
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name} ({cat.slug})
                        </option>
                      ))}
                    </select>
                    <small>Choose Men, Women, Kids, Home & Living, or Beauty</small>
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      placeholder="e.g., 50"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URLs (comma separated) *</label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({...formData, images: e.target.value})}
                    placeholder="https://images.unsplash.com/photo-123.jpg, https://images.unsplash.com/photo-456.jpg"
                    required
                  />
                  <small>💡 Tip: Use Unsplash image URLs. Separate multiple URLs with commas.</small>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
