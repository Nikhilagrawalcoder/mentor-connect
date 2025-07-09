# 🚀 Mentor Connect Deployment Guide

This guide provides step-by-step instructions for deploying your Mentor Connect application to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- [ ] MongoDB Atlas account (for database)
- [ ] Gmail account with 2FA enabled (for email)
- [ ] GitHub repository with your code
- [ ] Environment variables ready

## 🎯 Quick Start: Deploy to Render (Recommended)

### Step 1: Prepare Your Repository

1. **Update your code** with the latest changes
2. **Commit and push** to GitHub
3. **Ensure all files** are in the correct structure

### Step 2: Deploy Backend

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   ```
   Name: mentor-connect-backend
   Root Directory: backend
   Runtime: Node
   Build Command: npm instal
   Start Command: node server.js
   ```
5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mentor-connect
   Key=your_very_strong_jwt_secret_key_here
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_16_character_app_password
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```
6. **Click "Create Web Service"**

### Step 3: Deploy Frontend

1. **Click "New Static Site"**
2. **Connect your GitHub repository**
3. **Configure the service:**
   ```
   Name: mentor-connect-frontend
   Root Directory: frontend
   Build Command: (leave empty)
   Publish Directory: .
   ```
4. **Add Environment Variables:**
   ```
   API_BASE_URL=https://your-backend-url.onrender.com
   ```
5. **Click "Create Static Site"**

### Step 4: Update Frontend API URLs

1. **Get your backend URL** from Render dashboard
2. **Update all API calls** in your frontend JavaScript files
3. **Replace localhost:8000** with your backend URL

## 🌐 Alternative Deployment Options

### Option 1: Railway Deployment

#### Backend Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Set Environment Variables
```bash
railway variables set MONGODB_URI=your_mongodb_uri
railway variables set Key=your_jwt_secret
railway variables set EMAIL_USER=your_email
railway variables set EMAIL_PASS=your_app_password
railway variables set NODE_ENV=production
```

### Option 2: Heroku Deployment

#### Backend Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create mentor-connect-backend

# Add MongoDB addon
heroku addons:create mongolab

# Set environment variables
heroku config:set Key=your_jwt_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASS=your_app_password
heroku config:set NODE_ENV=production

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Option 3: Vercel Frontend Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd frontend
vercel

# Follow the prompts and configure:
# - Project name: mentor-connect-frontend
# - Directory: ./
# - Override settings: No
```

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. **Go to [MongoDB Atlas](https://mongodb.com/atlas)**
2. **Sign up for free account**
3. **Create a new project**

### Step 2: Create Cluster
1. **Click "Build a Database"**
2. **Choose "FREE" tier**
3. **Select cloud provider and region**
4. **Click "Create"**

### Step 3: Configure Network Access
1. **Go to "Network Access"**
2. **Click "Add IP Address"**
3. **Click "Allow Access from Anywhere"** (for development)
4. **Click "Confirm"**

### Step 4: Create Database User
1. **Go to "Database Access"**
2. **Click "Add New Database User"**
3. **Choose "Password" authentication**
4. **Set username and password**
5. **Select "Read and write to any database"**
6. **Click "Add User"**

### Step 5: Get Connection String
1. **Go to "Database"**
2. **Click "Connect"**
3. **Choose "Connect your application"**
4. **Copy the connection string**
5. **Replace `<password>` with your actual password**
6. **Add database name**: `?retryWrites=true&w=majority&appName=mentor-connect`

## 📧 Email Service Setup (Gmail)

### Step 1: Enable 2-Factor Authentication
1. **Go to Google Account settings**
2. **Security → 2-Step Verification**
3. **Enable 2FA**

### Step 2: Generate App Password
1. **Go to Google Account settings**
2. **Security → App passwords**
3. **Select "Mail"**
4. **Generate password**
5. **Copy the 16-character password**

### Step 3: Use in Environment Variables
```
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

## 🔧 Environment Variables Reference

### Required Variables
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mentor-connect

# JWT Secret (generate a strong random string)
Key=your_very_strong_jwt_secret_key_here

# Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password

# Environment
NODE_ENV=production
PORT=8000

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### Optional Variables
```env
# Custom port (if not using PORT)
PORT=8000

# Additional CORS origins
CORS_ORIGINS=https://domain1.com,https://domain2.com
```

## 🔒 Security Checklist

### Before Deployment
- [ ] Generate strong JWT secret (32+ characters)
- [ ] Use HTTPS URLs only
- [ ] Set up proper CORS origins
- [ ] Enable 2FA on Gmail account
- [ ] Use app passwords, not regular passwords
- [ ] Test all features locally

### After Deployment
- [ ] Verify HTTPS is working
- [ ] Test user registration
- [ ] Test email notifications
- [ ] Check CORS errors in browser console
- [ ] Monitor application logs
- [ ] Test booking functionality

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution:** Update CORS configuration in `server.js`
```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

### Issue 2: Database Connection Failed
**Solution:** Check MongoDB Atlas network access and connection string

### Issue 3: Email Not Sending
**Solution:** Verify Gmail app password and 2FA settings

### Issue 4: JWT Token Issues
**Solution:** Ensure JWT secret is properly set in environment variables

### Issue 5: Port Issues
**Solution:** Use `process.env.PORT` in server.js for cloud platforms

## 📊 Monitoring Your Deployment

### Render
- **Logs**: Available in dashboard
- **Metrics**: Built-in monitoring
- **Health Checks**: Automatic

### Railway
- **Logs**: `railway logs`
- **Metrics**: Dashboard monitoring
- **Deployments**: Automatic on git push

### Heroku
- **Logs**: `heroku logs --tail`
- **Metrics**: Heroku add-ons
- **Monitoring**: Built-in dashboard

## 🔄 Updating Your Deployment

### Backend Updates
1. **Make changes to your code**
2. **Commit and push to GitHub**
3. **Deployment will be automatic** (if connected to Git)

### Frontend Updates
1. **Update your code**
2. **Update API base URL** if backend URL changed
3. **Commit and push to GitHub**
4. **Deployment will be automatic**

## 📞 Support

If you encounter issues:
1. **Check the logs** in your deployment platform
2. **Verify environment variables** are set correctly
3. **Test locally** first
4. **Check browser console** for frontend errors
5. **Create an issue** in the GitHub repository

## 🎉 Success!

Once deployed, your Mentor Connect application will be available at:
- **Frontend**: `https://your-frontend-domain.com`
- **Backend API**: `https://your-backend-domain.com`

Share these URLs with your users and start connecting mentors with mentees!