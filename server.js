// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Use CORS middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN, // Replace with your client's origin
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// Session middleware
// Session middleware

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: true, // Set to true if HTTPS
    sameSite: 'None' // For cross-site cookies
  }
}));

// Add logging middleware to debug sessions
app.use((req, res, next) => {
  console.log("Session data:", req.session);
  next();
});

const resumeRoutes = require('./src/routes/resumeRoutes');
const contactFormRoutes = require('./src/routes/contactFormRoutes');
const userRoutes = require('./src/routes/userRoutes');
const resumeDownloadRoute = require('./src/routes/resumeDownloadRoute');

const errorHandler = require('./src/errorHandler');

// Use routes
app.use(resumeRoutes);
app.use(contactFormRoutes);
app.use(userRoutes);
app.use(resumeDownloadRoute);

// Error handler
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
    { useNewUrlParser: true, useUnifiedTopology: true } // Recommended options
  )
  .then(() => {
    console.log("Connected to MongoDB!");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
