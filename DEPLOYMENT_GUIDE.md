# 🚀 PrimeBasket Deployment Guide

## Quick Deployment (Free Hosting)

### Prerequisites
- GitHub account (✅ Already done)
- MongoDB Atlas account (Free)
- Render account (Free - for Backend)
- Vercel account (Free - for Frontend)

---

## Step 1: Setup MongoDB Atlas (5 minutes)

1. Go to **mongodb.com/cloud/atlas**
2. Sign up / Login
3. Create **Free Cluster** (M0)
4. Click **Connect** → **Connect your application**
5. Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your password
7. Add `/primebasket` at the end

**Example:**
```
mongodb+srv://samarth:mypassword@cluster0.xxxxx.mongodb.net/primebasket
```

---

## Step 2: Deploy Backend on Render (10 minutes)

1. Go to **render.com** and sign up
2. Click **New +** → **Web Service**
3. Connect your GitHub repository: `samarth101010/PrimeBasket`
4. Configure:
   - **Name:** primebasket-backend
   - **Root Directory:** Backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Add Environment Variables (click **Advanced**):
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=primebasket_secret_key_2024
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

6. Click **Create Web Service**
7. Wait 5-10 minutes for deployment
8. Copy your backend URL (e.g., `https://primebasket-backend.onrender.com`)

---

## Step 3: Deploy Frontend on Vercel (5 minutes)

1. Go to **vercel.com** and sign up with GitHub
2. Click **Add New** → **Project**
3. Import `samarth101010/PrimeBasket`
4. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** Frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** build

5. Add Environment Variable:
   - **Name:** `REACT_APP_API_URL`
   - **Value:** `https://your-backend-url.onrender.com/api`
   (Use the URL from Step 2)

6. Click **Deploy**
7. Wait 2-3 minutes
8. Your site is live! 🎉

---

## Step 4: Update Backend CORS (Important!)

After frontend is deployed, update Backend environment variable on Render:

1. Go to Render dashboard → Your backend service
2. Environment → Edit
3. Update `FRONTEND_URL` to your Vercel URL
4. Save (will auto-redeploy)

---

## Step 5: Seed Database

1. Go to Render dashboard → Your backend service
2. Click **Shell** tab
3. Run: `node utils/seeder.js`
4. Wait for "Database seeded successfully"

---

## 🎉 Your App is Live!

**Frontend:** https://your-app.vercel.app
**Backend:** https://your-backend.onrender.com

### Test Accounts:
- **Admin:** admin@primebasket.com / admin123
- **User:** user@test.com / user123

---

## 📱 Share with Your Mentor

Send them:
1. **Live URL:** Your Vercel link
2. **GitHub:** https://github.com/samarth101010/PrimeBasket
3. **Test Credentials:** Admin & User accounts above

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Render:** Backend sleeps after 15 min inactivity (takes 30s to wake up)
- **Vercel:** 100GB bandwidth/month (more than enough)
- **MongoDB Atlas:** 512MB storage (enough for demo)

### First Load:
- First request may take 30 seconds (backend waking up)
- After that, it's fast!

### Email Features:
- Optional - works without email configuration
- To enable: Add Gmail credentials in Render environment variables

---

## 🐛 Troubleshooting

### Backend not connecting?
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Verify MONGODB_URI is correct

### Frontend API errors?
- Check REACT_APP_API_URL in Vercel
- Ensure backend URL is correct

### CORS errors?
- Update FRONTEND_URL in Render backend
- Redeploy backend

---

## 🎓 For Your Mentor Demo

1. **Show Live Site** - Browse products, add to cart
2. **User Flow** - Register, login, place order
3. **Admin Panel** - Show dashboard, manage products
4. **GitHub Code** - Show clean, organized code
5. **Features** - Search, filters, reviews, coupons

---

## 💰 Cost: $0/month (Free Forever!)

All services used are free tier:
- ✅ Render Free
- ✅ Vercel Free
- ✅ MongoDB Atlas Free

---

**Deployment Time:** 20-30 minutes total
**Your project will be live and accessible worldwide!** 🌍
