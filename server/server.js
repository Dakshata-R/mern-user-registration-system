const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration - Updated for Render
const allowedOrigins = [
  'http://localhost:3000',
  'https://mern-user-registration-system-client.onrender.com',
  'https://mern-user-registration-system.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-auth-token',  
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['x-auth-token']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Passport middleware
require('./config/passport')(passport);
app.use(passport.initialize());

// Database connection
const connectDB = require('./config/db');
connectDB();

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
  });
} else {
  // Root route with API documentation for development
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
      frontend_url: process.env.NODE_ENV === 'production' 
        ? 'https://mern-user-registration-system-client.onrender.com' 
        : 'http://localhost:3000',
      note: process.env.NODE_ENV === 'production'
        ? 'API server is running in production mode'
        : 'This is the API server. For the web interface, visit the frontend URL.'
    });
  });
}

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/registrations', require('./routes/registration.routes'));

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
  });
}

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    msg: 'API endpoint not found',
    requested: req.originalUrl,
    available_endpoints: {
      auth: '/api/auth',
      registrations: '/api/registrations'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
});