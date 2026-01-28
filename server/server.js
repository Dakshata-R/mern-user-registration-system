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

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/registrations', require('./routes/registration.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));