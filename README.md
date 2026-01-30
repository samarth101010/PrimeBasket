# PrimeBasket - E-Commerce Platform

A full-stack e-commerce web application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### Customer Features
- Browse products by categories (Men, Women, Kids, Home & Living, Beauty)
- Advanced search with autocomplete suggestions
- Product details with image zoom and reviews
- Shopping cart and wishlist
- User authentication and profile management
- Order placement and tracking
- Product reviews and ratings
- Coupon code application

### Admin Features
- Dashboard with sales statistics
- Product management (Add, Edit, Delete)
- Order management and status updates
- User management
- Coupon management
- Category management

## Tech Stack

### Frontend
- React 18.2.0
- React Router 6.20.0
- Context API for state management
- Axios for API calls
- React Icons
- React Toastify for notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- Bcrypt for password hashing
- Multer for file uploads
- NodeMailer for email notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/primebasket
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

Seed the database:
```bash
node utils/seeder.js
```

Start the backend server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm start
```

The application will open at `http://localhost:3000`

## Default Credentials

### Admin Account
- Email: admin@primebasket.com
- Password: admin123

### User Account
- Email: user@test.com
- Password: user123

## Project Structure

```
PrimeBasket/
├── Backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── Frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── context/     # State management
│       └── services/    # API services
│
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/forgot-password` - Request password reset
- POST `/api/auth/reset-password/:token` - Reset password

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Orders
- POST `/api/orders` - Create order
- GET `/api/orders/myorders` - Get user orders
- GET `/api/orders/:id` - Get order details
- PUT `/api/orders/:id/status` - Update order status (Admin)

### Reviews
- GET `/api/reviews/product/:productId` - Get product reviews
- POST `/api/reviews` - Create review
- PUT `/api/reviews/:id` - Update review
- DELETE `/api/reviews/:id` - Delete review

### Coupons
- POST `/api/coupons/validate` - Validate coupon
- GET `/api/coupons` - Get all coupons (Admin)
- POST `/api/coupons` - Create coupon (Admin)
- PUT `/api/coupons/:id` - Update coupon (Admin)
- DELETE `/api/coupons/:id` - Delete coupon (Admin)

## Features Highlights

### Search & Filter
- Real-time search with autocomplete
- Filter by category, price, brand, rating
- Sort by price, newest, popularity
- Pagination support

### User Experience
- Responsive design for all devices
- Loading states and skeleton screens
- Toast notifications
- Image lazy loading
- Recently viewed products
- Quick view modal

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control
- Input validation

### Email Notifications
- Welcome email on registration
- Order confirmation emails
- Password reset emails
- Order status updates

## Development

### Backend Development
```bash
cd Backend
npm run dev  # Runs with nodemon
```

### Frontend Development
```bash
cd Frontend
npm start  # Runs on port 3000
```

## Database Schema

### User
- name, email, password
- role (user/admin)
- addresses array
- timestamps

### Product
- name, description, price
- brand, category
- images array
- stock, rating, numReviews
- timestamps

### Order
- user, items array
- shippingAddress
- paymentMethod, paymentStatus
- orderStatus
- totalPrice, coupon
- timestamps

### Review
- user, product
- rating, comment
- isVerifiedPurchase
- timestamps

### Coupon
- code, description
- discountType, discountValue
- minOrderAmount, maxDiscountAmount
- usageLimit, usedCount
- validFrom, validUntil
- timestamps

## Contributing

This is a student project. For any queries, please contact the project maintainer.

## License

This project is created for educational purposes.

---

**Developed by:** [Your Name]
**Project Type:** Full Stack E-Commerce Application
**Technologies:** MERN Stack (MongoDB, Express.js, React, Node.js)
