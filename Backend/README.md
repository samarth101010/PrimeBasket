# PrimeBasket Backend API

Complete MERN Stack E-commerce Backend with MongoDB, Express.js, and Node.js

## Features

- ✅ User Authentication (JWT)
- ✅ Role-based Authorization (User/Admin)
- ✅ Product Management (CRUD)
- ✅ Category Management
- ✅ Shopping Cart
- ✅ Order Management
- ✅ Review & Rating System
- ✅ Admin Dashboard with Statistics
- ✅ Image Upload (Multer)
- ✅ Search & Filter Products
- ✅ Pagination
- ✅ Input Validation
- ✅ Error Handling

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Input validation

## Installation

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Setup MongoDB

Make sure MongoDB is installed and running on your system.

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
```

### 3. Configure Environment Variables

Edit the `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/primebasket
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Seed Database (Optional)

Populate database with sample data:

```bash
node utils/seeder.js
```

This creates:
- Admin user: `admin@primebasket.com` / `admin123`
- Test user: `user@test.com` / `user123`
- 5 Categories
- 8 Sample Products

### 5. Start Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server runs on: `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/:itemId` - Remove from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review (Protected)
- `PUT /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)

### User Profile
- `GET /api/users/profile` - Get profile (Protected)
- `PUT /api/users/profile` - Update profile (Protected)
- `POST /api/users/addresses` - Add address (Protected)
- `PUT /api/users/addresses/:addressId` - Update address (Protected)
- `DELETE /api/users/addresses/:addressId` - Delete address (Protected)

### Admin
- `GET /api/admin/stats` - Dashboard statistics (Admin)
- `GET /api/admin/users` - Get all users (Admin)
- `PUT /api/admin/users/:id` - Update user (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)
- `GET /api/admin/orders` - Get all orders (Admin)
- `GET /api/admin/products` - Get all products (Admin)

## Query Parameters

### Products
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `search` - Search by name/brand/description
- `category` - Filter by category ID
- `brand` - Filter by brand
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `rating` - Minimum rating
- `discount` - Minimum discount
- `sort` - Sort by: `price-low`, `price-high`, `rating`, `newest`

Example:
```
GET /api/products?category=123&minPrice=500&maxPrice=2000&sort=price-low&page=1
```

## Authentication

Protected routes require JWT token in header:

```
Authorization: Bearer <token>
```

## Project Structure

```
Backend/
├── controllers/      # Request handlers
├── models/          # Mongoose models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── uploads/         # Uploaded files
├── server.js        # Entry point
├── .env            # Environment variables
└── package.json    # Dependencies
```

## Error Handling

All errors return JSON:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

## Testing with Postman

1. Import the API endpoints
2. Set base URL: `http://localhost:5000/api`
3. For protected routes, add token to Authorization header
4. Test all CRUD operations

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use strong `JWT_SECRET`
3. Use MongoDB Atlas for database
4. Enable CORS for your frontend domain
5. Use HTTPS
6. Set up proper logging
7. Use PM2 for process management

## Support

For issues or questions, please create an issue in the repository.

## License

MIT
