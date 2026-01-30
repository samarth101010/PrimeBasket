# PrimeBasket API Documentation

Complete API reference for PrimeBasket E-commerce Backend

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token_here"
  }
}
```

### Get Current User
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

---

## 2. Product Endpoints

### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 12)
- `search` (string) - Search term
- `category` (string) - Category ID
- `brand` (string) - Brand name
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `rating` (number) - Minimum rating
- `discount` (number) - Minimum discount
- `sort` (string) - Sort by: price-low, price-high, rating, newest

**Example:**
```
GET /api/products?category=123&minPrice=500&maxPrice=2000&sort=price-low
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

### Get Single Product
```http
GET /api/products/:id
```

### Create Product (Admin Only)
```http
POST /api/products
```
**Headers:** `Authorization: Bearer <admin_token>`

**Body (multipart/form-data):**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 999,
  "originalPrice": 1499,
  "discount": 33,
  "brand": "Brand Name",
  "category": "category_id",
  "stock": 50,
  "sizes": ["S", "M", "L"],
  "colors": ["Red", "Blue"],
  "images": [file1, file2]
}
```

### Update Product (Admin Only)
```http
PUT /api/products/:id
```

### Delete Product (Admin Only)
```http
DELETE /api/products/:id
```

### Get Featured Products
```http
GET /api/products/featured
```

---

## 3. Category Endpoints

### Get All Categories
```http
GET /api/categories
```

### Get Single Category
```http
GET /api/categories/:id
```

### Create Category (Admin Only)
```http
POST /api/categories
```

**Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic items and gadgets"
}
```

### Update Category (Admin Only)
```http
PUT /api/categories/:id
```

### Delete Category (Admin Only)
```http
DELETE /api/categories/:id
```

---

## 4. Cart Endpoints

### Get User Cart
```http
GET /api/cart
```
**Headers:** `Authorization: Bearer <token>`

### Add Item to Cart
```http
POST /api/cart
```

**Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

### Update Cart Item
```http
PUT /api/cart/:itemId
```

**Body:**
```json
{
  "quantity": 3
}
```

### Remove Item from Cart
```http
DELETE /api/cart/:itemId
```

### Clear Cart
```http
DELETE /api/cart
```

---

## 5. Order Endpoints

### Create Order
```http
POST /api/orders
```

**Body:**
```json
{
  "items": [
    {
      "product": "product_id",
      "name": "Product Name",
      "brand": "Brand",
      "image": "image_url",
      "quantity": 2,
      "price": 999
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "pincode": "10001"
  },
  "paymentMethod": "cod",
  "itemsPrice": 1998,
  "shippingPrice": 99,
  "totalPrice": 2097
}
```

### Get My Orders
```http
GET /api/orders/myorders
```

### Get Order by ID
```http
GET /api/orders/:id
```

### Update Order Status (Admin Only)
```http
PUT /api/orders/:id/status
```

**Body:**
```json
{
  "orderStatus": "Shipped"
}
```

**Status Options:**
- Processing
- Confirmed
- Shipped
- Out for Delivery
- Delivered
- Cancelled

### Cancel Order
```http
PUT /api/orders/:id/cancel
```

**Body:**
```json
{
  "reason": "Changed my mind"
}
```

---

## 6. Review Endpoints

### Get Product Reviews
```http
GET /api/reviews/product/:productId
```

### Create Review
```http
POST /api/reviews
```

**Body:**
```json
{
  "product": "product_id",
  "rating": 5,
  "comment": "Great product!"
}
```

### Update Review
```http
PUT /api/reviews/:id
```

### Delete Review
```http
DELETE /api/reviews/:id
```

---

## 7. User Profile Endpoints

### Get Profile
```http
GET /api/users/profile
```

### Update Profile
```http
PUT /api/users/profile
```

**Body:**
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "avatar": "avatar_url"
}
```

### Add Address
```http
POST /api/users/addresses
```

**Body:**
```json
{
  "fullName": "John Doe",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "isDefault": true
}
```

### Update Address
```http
PUT /api/users/addresses/:addressId
```

### Delete Address
```http
DELETE /api/users/addresses/:addressId
```

---

## 8. Admin Endpoints

### Get Dashboard Statistics
```http
GET /api/admin/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalProducts": 200,
    "totalOrders": 500,
    "totalCategories": 10,
    "totalRevenue": 150000,
    "recentOrders": [...],
    "ordersByStatus": [...],
    "lowStockProducts": [...],
    "monthlyRevenue": [...]
  }
}
```

### Get All Users
```http
GET /api/admin/users?page=1&limit=10
```

### Update User
```http
PUT /api/admin/users/:id
```

**Body:**
```json
{
  "role": "admin",
  "isActive": true
}
```

### Delete User
```http
DELETE /api/admin/users/:id
```

### Get All Orders
```http
GET /api/admin/orders?page=1&limit=10&status=Processing
```

### Get All Products (Admin View)
```http
GET /api/admin/products?page=1&limit=10
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding it for production.

## CORS

CORS is enabled for all origins in development. Configure for specific domains in production.

## File Uploads

- Maximum file size: 5MB
- Allowed formats: JPEG, JPG, PNG, GIF, WEBP
- Maximum files per upload: 5

---

## Testing

Use Postman or any API client to test endpoints.

**Quick Test Flow:**
1. Register a user
2. Login to get token
3. Use token for protected routes
4. Test CRUD operations

**Admin Testing:**
- Email: `admin@primebasket.com`
- Password: `admin123`

**User Testing:**
- Email: `user@test.com`
- Password: `user123`
