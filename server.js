// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

// Use CORS middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN, // Replace with your client's origin
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));


// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());



// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
  }),
  cookie: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true only in production
    sameSite: 'None', // Ensure this is consistent with your frontend's cookie settings
    maxAge: 86400000, // 24 hours
  },
}));

// Add logging middleware to debug sessions
app.use((req, res, next) => {
  console.log("Session data:", req.session);
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'https://skilliii-qqu5vb3o3-jaykumars-projects.vercel.app');
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
