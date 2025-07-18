# Mentor Connect

A comprehensive platform designed to connect mentors with mentees, facilitating skill development and career growth through seamless booking and communication systems.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**: Secure login/register system with JWT tokens
- **Role-based Access**: Separate interfaces for mentors and mentees
- **Mentor Discovery**: Search and filter mentors by location and expertise
- **Booking System**: Schedule appointments with real-time availability checking
- **Email Notifications**: Automated confirmation and cancellation emails
- **Meeting Integration**: Built-in support for Google Meet links

### User Experience
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Updates**: Live booking status and availability
- **Profile Management**: Complete user profile customization
- **Booking History**: Track all past and upcoming sessions

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security
- **Nodemailer** - Email service integration

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with responsive design
- **Vanilla JavaScript** - Client-side functionality
- **SweetAlert2** - Enhanced user notifications

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nikhilagrawalcoder/mentor-connect.git
   cd mentor-connect
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   Key=your_jwt_secret_key
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally or use MongoDB Atlas
   - The application will automatically create necessary collections

## 🏃‍♂️ Running the Application

### Backend Server
```bash
cd backend
npm start
```
The server will start on `http://localhost:8000`

### Frontend
Open the `frontend/index.html` file in your browser or serve it using a local server:
```bash
cd frontend
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```

## 🌐 Deployment Guide

### Option 1: Deploy to Render (Recommended for Beginners)

#### Backend Deployment on Render
1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository

2. **Deploy Backend Service**
   - Click "New Web Service"
   - Connect your GitHub repo
   - Configure settings:
     ```
     Name: mentor-connect-backend
     Root Directory: backend
     Runtime: Node
     Build Command: npm install
     Start Command: node server.js
     ```

3. **Environment Variables**
   Add these in Render dashboard:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mentor-connect
   Key=your_jwt_secret_key
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   PORT=8000
   ```

#### Frontend Deployment on Render
1. **Deploy Static Site**
   - Click "New Static Site"
   - Connect your GitHub repo
   - Configure settings:
     ```
     Name: mentor-connect-frontend
     Root Directory: frontend
     Build Command: (leave empty)
     Publish Directory: .
     ```

### Option 2: Deploy to Railway

#### Backend Deployment
1. **Create Railway Account**
   - Sign up at [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Deploy Service**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

3. **Environment Variables**
   Add in Railway dashboard or via CLI:
   ```bash
   railway variables set MONGODB_URI=your_mongodb_uri
   railway variables set Key=your_jwt_secret
   railway variables set EMAIL_USER=your_email
   railway variables set EMAIL_PASS=your_app_password
   ```

### Option 3: Deploy to Heroku

#### Backend Deployment
1. **Create Heroku Account**
   - Sign up at [heroku.com](https://heroku.com)
   - Install Heroku CLI

2. **Deploy Application**
   ```bash
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
   
   # Deploy
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

3. **Create Procfile**
   Create `backend/Procfile`:
   ```
   web: node server.js
   ```

### Option 4: Deploy to Vercel

#### Frontend Deployment
1. **Create Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub repository

2. **Deploy Frontend**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   cd frontend
   vercel
   ```

### Option 5: Deploy to DigitalOcean App Platform

#### Full Stack Deployment
1. **Create DigitalOcean Account**
   - Sign up at [digitalocean.com](https://digitalocean.com)

2. **Deploy via App Platform**
   - Connect your GitHub repository
   - Configure both backend and frontend services
   - Set environment variables in the dashboard

## 🔧 Production Configuration

### Backend Production Setup

1. **Update package.json**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. **Environment Variables for Production**
   ```env
   NODE_ENV=production
   PORT=8000
   MONGODB_URI=your_production_mongodb_uri
   Key=your_strong_jwt_secret
   EMAIL_USER=your_production_email
   EMAIL_PASS=your_production_app_password
   ```

3. **CORS Configuration**
   Update `server.js` for production:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend-domain.com', 'http://localhost:3000'],
     credentials: true
   }));
   ```

### Frontend Production Setup

1. **Update API Base URL**
   In your JavaScript files, update the API base URL:
   ```javascript
   const API_BASE_URL = 'https://your-backend-domain.com';
   ```

2. **Build Optimization**
   - Minify CSS and JavaScript
   - Optimize images
   - Enable gzip compression

## 🗄️ Database Deployment

### MongoDB Atlas (Recommended)
1. **Create Atlas Cluster**
   - Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free cluster

2. **Configure Network Access**
   - Add your IP or `0.0.0.0/0` for all IPs

3. **Create Database User**
   - Username and password for connection

4. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/mentor-connect
   ```

### Local MongoDB (Development Only)
```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
sudo apt-get install mongodb   # Ubuntu

# Start MongoDB service
brew services start mongodb-community
```

## 📧 Email Service Setup

### Gmail SMTP Configuration
1. **Enable 2-Factor Authentication**
2. **Generate App Password**
   - Go to Google Account settings
   - Security → App passwords
   - Generate password for "Mail"

3. **Environment Variables**
   ```env
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

## 🔒 Security Considerations

### Production Security Checklist
- [ ] Use HTTPS for all communications
- [ ] Set strong JWT secrets
- [ ] Configure proper CORS origins
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting
- [ ] Set up proper logging
- [ ] Regular security updates

### SSL/HTTPS Setup
- **Render/Railway/Heroku**: Automatic SSL
- **Vercel**: Automatic SSL
- **Custom Domain**: Use Let's Encrypt or Cloudflare

## 📊 Monitoring and Logging

### Application Monitoring
- **Render**: Built-in monitoring
- **Railway**: Built-in logs and metrics
- **Heroku**: Heroku logs and add-ons
- **Custom**: Use services like Sentry, LogRocket

### Database Monitoring
- **MongoDB Atlas**: Built-in monitoring
- **Custom**: Set up MongoDB monitoring tools

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Test all features locally
- [ ] Update environment variables
- [ ] Check database connections
- [ ] Verify email configuration
- [ ] Test API endpoints

### Post-Deployment
- [ ] Verify application is running
- [ ] Test user registration/login
- [ ] Check email notifications
- [ ] Monitor error logs
- [ ] Test booking functionality
- [ ] Verify CORS configuration

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "mentor",
  "expertise": "JavaScript",
  "location": "New York",
  "meetLink": "https://meet.google.com/abc-defg-hij"
}
```

#### Login User
```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Logout User
```http
GET /user/logout
Authorization: Bearer <jwt_token>
```

### Mentor Endpoints

#### Get All Mentors
```http
GET /user/mentors
```

#### Get Mentors by Location
```http
GET /user/mentors/:location
```

#### Get Mentors by Expertise
```http
GET /user/mentors/expertise/:value
```

### Booking Endpoints

#### Create Booking (Mentee only)
```http
POST /booking/create
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "mentorId": "mentor_id_here",
  "bookingDate": "2024-01-15",
  "bookingSlot": "10:00 AM",
  "userEmail": "mentee@example.com"
}
```

#### Get User Bookings
```http
GET /booking/paticularUser
Authorization: Bearer <jwt_token>
```

#### Cancel Booking (Mentor only)
```http
DELETE /booking/remove/:bookingId
Authorization: Bearer <jwt_token>
```

#### Check Booking Status
```http
GET /booking/check-bookings/:bookingId
```

## 🎯 Usage Examples

### For Mentees
1. Register with your details and select "mentee" role
2. Browse available mentors by location or expertise
3. Book appointments with preferred mentors
4. Receive email confirmations with meeting links
5. Track your booking history

### For Mentors
1. Register with your expertise and location
2. Set up your Google Meet link
3. Manage incoming booking requests
4. Cancel bookings with 24-hour notice
5. View your mentoring schedule

## 🔧 Configuration

### Email Setup
To enable email notifications:
1. Use a Gmail account
2. Enable 2-factor authentication
3. Generate an App Password
4. Add credentials to `.env` file

### Database Configuration
- Default MongoDB connection: `mongodb://localhost:27017/mentor-connect`
- For production, use MongoDB Atlas or other cloud providers

## 🚧 Project Structure

```
mentor-connect/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── middlewares/
│   │   ├── authenticationMiddleware.js
│   │   └── authorizationMiddleware.js
│   ├── models/
│   │   ├── userModel.js          # User schema
│   │   ├── bookingModel.js       # Booking schema
│   │   └── blacklistModel.js     # Token blacklist
│   ├── routes/
│   │   ├── userRoute.js          # User endpoints
│   │   └── bookingRoute.js       # Booking endpoints
│   └── server.js                 # Main server file
├── frontend/
│   ├── assets/
│   ├── script/                   # JavaScript files
│   ├── styles/                   # CSS files
│   └── *.html                    # HTML pages
└── README.md
```

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Stateless authentication with token blacklisting
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin resource sharing configuration
- **Environment Variables**: Sensitive data stored in .env files

## 🚀 Future Enhancements

- [ ] Real-time video calling integration
- [ ] Chat functionality between mentors and mentees
- [ ] Payment gateway integration
- [ ] Advanced search and filtering
- [ ] Rating and review system
- [ ] Mobile application
- [ ] Calendar integration
- [ ] Automated scheduling suggestions

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact: nikhilagrawal0605@gmail.com

## 🙏 Acknowledgments

- Express.js community for the robust framework
- MongoDB team for the excellent database
- All contributors who help improve this project

---

**Made with ❤️ by Nikhil Agrawal**
