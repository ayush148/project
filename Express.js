// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/review');
const path = require('path');

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://127.0.0.1:5000', 'http://localhost:5000'], // Replace with your Flask frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Allow cookies to be sent with requests
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session management
app.use(session({
    secret: 'your-secret-key', // Replace with a secure random key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routes
app.use('/auth', authRoutes);
app.use('/review', reviewRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
