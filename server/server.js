const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-auth-token',  
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['Cross-Origin-Opener-Policy','x-auth-token']
}));

app.options('*', cors());

// Passport middleware
require('./config/passport')(passport);
app.use(passport.initialize());

// Database connection
const connectDB = require('./config/db');
connectDB();

// Root route with API documentation
app.get('/', (req, res) => {
  res.json({
    status: 'Server is running',
    message: 'MERN Registration App Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    endpoints: {
      authentication: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        google_login: 'POST /api/auth/google',
        get_current_user: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      },
      registrations: {
        create: 'POST /api/registrations',
        get_all: 'GET /api/registrations (admin only)',
        get_my: 'GET /api/registrations/my-registrations',
        get_single: 'GET /api/registrations/:id',
        update: 'PUT /api/registrations/:id',
        delete: 'DELETE /api/registrations/:id'
      }
    },
    frontend_url: 'http://localhost:3000',
    note: 'This is the API server. For the web interface, visit the frontend URL.'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/registrations', require('./routes/registration.routes'));

// 404 handler for undefined API routes
app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({ 
      msg: 'API endpoint not found',
      requested: req.originalUrl 
    });
  } else {
    res.redirect('http://localhost:3000');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));