# Quick Start Guide - PrimeBasket Backend

Get your backend up and running in 5 minutes!

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

## Step 1: Install MongoDB

### Windows
1. Download from: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Or run: `mongod` in terminal

### Mac
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

## Step 2: Install Dependencies

```bash
cd Backend
npm install
```

## Step 3: Configure Environment

The `.env` file is already created. You can modify it if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/primebasket
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

## Step 4: Seed Database

Populate with sample data:

```bash
node utils/seeder.js
```

This creates:
- ✅ Admin user
- ✅ Test user
- ✅ 5 Categories
- ✅ 8 Sample products

## Step 5: Start Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 API URL: http://localhost:5000
```

## Step 6: Test API

Open browser or Postman:
```
http://localhost:5000
```

You should see:
```json
{
  "message": "PrimeBasket API is running"
}
```

## Login Credentials

### Admin Account
- Email: `admin@primebasket.com`
- Password: `admin123`

### User Account
- Email: `user@test.com`
- Password: `user123`

## Quick API Tests

### 1. Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@primebasket.com",
  "password": "admin123"
}
```

### 2. Get Products
```bash
GET http://localhost:5000/api/products
```

### 3. Get Categories
```bash
GET http://localhost:5000/api/categories
```

### 4. Get Dashboard Stats (Admin)
```bash
GET http://localhost:5000/api/admin/stats
Authorization: Bearer <your_token>
```

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` file or kill the process using port 5000

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:** Run `npm install` again

## Next Steps

1. ✅ Backend is running
2. 📱 Connect your Frontend
3. 🧪 Test all API endpoints
4. 🎨 Customize as needed

## Folder Structure

```
Backend/
├── controllers/     # Business logic
├── models/         # Database schemas
├── routes/         # API routes
├── middleware/     # Auth & validation
├── utils/          # Helper functions
├── uploads/        # Uploaded images
├── server.js       # Entry point
└── .env           # Configuration
```

## Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
node utils/seeder.js  # Seed database
```

## API Documentation

Full API documentation: `API_DOCUMENTATION.md`

## Support

If you encounter any issues:
1. Check MongoDB is running
2. Check all dependencies are installed
3. Check `.env` configuration
4. Check console for error messages

## Production Deployment

Before deploying:
1. Change `JWT_SECRET` to a strong secret
2. Use MongoDB Atlas for database
3. Set `NODE_ENV=production`
4. Configure CORS for your domain
5. Use HTTPS
6. Add rate limiting
7. Use PM2 for process management

---

🎉 **Congratulations!** Your backend is ready!

Now connect it to your Frontend and start building amazing features!
