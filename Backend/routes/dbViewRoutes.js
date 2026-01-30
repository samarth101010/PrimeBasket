const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Review = require('../models/Review');

// Get all collections data
router.get('/view', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const products = await Product.find().populate('category');
    const categories = await Category.find();
    const orders = await Order.find().populate('user', 'name email');
    const carts = await Cart.find().populate('user', 'name email');
    const reviews = await Review.find().populate('user', 'name').populate('product', 'name');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PrimeBasket Database Viewer</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
          }
          .container { 
            max-width: 1400px; 
            margin: 0 auto; 
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 3px solid #f0f0f0;
          }
          h1 { 
            color: #2d3748;
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .subtitle {
            color: #718096;
            font-size: 16px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 50px;
          }
          .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
          }
          .stat-card h3 { 
            font-size: 13px; 
            margin-bottom: 12px; 
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
          }
          .stat-card .number { 
            font-size: 36px; 
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .section { 
            margin-bottom: 25px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s;
          }
          .section:hover {
            border-color: #667eea;
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.1);
          }
          .section-header {
            background: linear-gradient(135deg, #4c51bf 0%, #667eea 100%);
            color: white;
            padding: 18px 25px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
          }
          .section-header:hover { 
            background: linear-gradient(135deg, #434190 0%, #5a67d8 100%);
          }
          .section-header .icon {
            font-size: 24px;
            margin-right: 10px;
          }
          .section-header .left {
            display: flex;
            align-items: center;
          }
          .section-content {
            padding: 25px;
            display: none;
            background: #f7fafc;
          }
          .section-content.active { display: block; }
          pre { 
            background: #2d3748; 
            color: #e2e8f0;
            padding: 20px; 
            border-radius: 10px;
            overflow-x: auto;
            font-size: 13px;
            line-height: 1.8;
            font-family: 'Courier New', monospace;
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
          }
          .toggle { 
            background: white;
            color: #4c51bf;
            border: none;
            padding: 8px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .toggle:hover {
            background: #edf2f7;
            transform: scale(1.05);
          }
          .refresh-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 40px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            display: block;
            margin: 0 auto 40px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            transition: all 0.3s;
          }
          .refresh-btn:hover { 
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
          }
          .empty { 
            color: #a0aec0; 
            font-style: italic;
            text-align: center;
            padding: 40px;
            font-size: 16px;
          }
          .badge {
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-left: 10px;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .section {
            animation: fadeIn 0.5s ease;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🗄️ Database Viewer</h1>
            <p class="subtitle">PrimeBasket MongoDB Collections</p>
          </div>
          
          <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Data</button>

          <div class="stats">
            <div class="stat-card">
              <h3>Users</h3>
              <div class="number">${users.length}</div>
            </div>
            <div class="stat-card">
              <h3>Products</h3>
              <div class="number">${products.length}</div>
            </div>
            <div class="stat-card">
              <h3>Orders</h3>
              <div class="number">${orders.length}</div>
            </div>
            <div class="stat-card">
              <h3>Categories</h3>
              <div class="number">${categories.length}</div>
            </div>
            <div class="stat-card">
              <h3>Carts</h3>
              <div class="number">${carts.length}</div>
            </div>
            <div class="stat-card">
              <h3>Reviews</h3>
              <div class="number">${reviews.length}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-header" onclick="toggleSection('users')">
              <div class="left">
                <span class="icon">👥</span>
                <span>Users Collection</span>
                <span class="badge">${users.length} records</span>
              </div>
              <button class="toggle">Show/Hide</button>
            </div>
            <div class="section-content" id="users">
              ${users.length > 0 ? `<pre>${JSON.stringify(users, null, 2)}</pre>` : '<p class="empty">No users found</p>'}
            </div>
          </div>

          <div class="section">
            <div class="section-header" onclick="toggleSection('products')">
              <div class="left">
                <span class="icon">📦</span>
                <span>Products Collection</span>
                <span class="badge">${products.length} records</span>
              </div>
              <button class="toggle">Show/Hide</button>
            </div>
            <div class="section-content" id="products">
              ${products.length > 0 ? `<pre>${JSON.stringify(products, null, 2)}</pre>` : '<p class="empty">No products found</p>'}
            </div>
          </div>

          <div class="section">
            <div class="section-header" onclick="toggleSection('categories')">
              <div class="left">
                <span class="icon">📁</span>
                <span>Categories Collection</span>
                <span class="badge">${categories.length} records</span>
              </div>
              <button class="toggle">Show/Hide</button>
            </div>
            <div class="section-content" id="categories">
              ${categories.length > 0 ? `<pre>${JSON.stringify(categories, null, 2)}</pre>` : '<p class="empty">No categories found</p>'}
            </div>
          </div>

          <div class="section">
            <div class="section-header" onclick="toggleSection('orders')">
              <div class="left">
                <span class="icon">🛍️</span>
                <span>Orders Collection</span>
                <span class="badge">${orders.length} records</span>
              </div>
              <button class="toggle">Show/Hide</button>
            </div>
            <div class="section-content" id="orders">
              ${orders.length > 0 ? `<pre>${JSON.stringify(orders, null, 2)}</pre>` : '<p class="empty">No orders found</p>'}
            </div>
          </div>

          <div class="section">
            <div class="section-header" onclick="toggleSection('carts')">
              <div class="left">
                <span class="icon">🛒</span>
                <span>Carts Collection</span>
                <span class="badge">${carts.length} records</span>
              </div>
              <button class="toggle">Show/Hide</button>
            </div>
            <div class="section-content" id="carts">
              ${carts.length > 0 ? `<pre>${JSON.stringify(carts, null, 2)}</pre>` : '<p class="empty">No carts found</p>'}
            </div>
          </div>

          <div class="section">
            <div class="section-header" onclick="toggleSection('reviews')">
              <div class="left">
                <span class="icon">⭐</span>
                <span>Reviews Collection</span>
                <span class="badge">${reviews.length} records</span>
              </div>
              <button class="toggle">Show/Hide</button>
            </div>
            <div class="section-content" id="reviews">
              ${reviews.length > 0 ? `<pre>${JSON.stringify(reviews, null, 2)}</pre>` : '<p class="empty">No reviews found</p>'}
            </div>
          </div>
        </div>

        <script>
          function toggleSection(id) {
            const section = document.getElementById(id);
            section.classList.toggle('active');
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send(`
      <h1>Error loading database</h1>
      <pre>${error.message}</pre>
    `);
  }
});

module.exports = router;
