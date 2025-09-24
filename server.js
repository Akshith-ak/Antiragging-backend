const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
// Use the port provided by the hosting service (like Render), or 5000 for local development
const PORT = process.env.PORT || 5000;

// --- 1. DEFINE YOUR "GUEST LIST" (ALLOWED ORIGINS) ---
// These are the only URLs that are allowed to make requests to your backend.
const allowedOrigins = [
  // **IMPORTANT: REPLACE THIS WITH YOUR DEPLOYED FRONTEND URL**
  // It could be from GitHub Pages or from Render itself.
  'https://akshith-ak.github.io', // Your GitHub pages URL
  'https://your-frontend-name.onrender.com', // **<-- IF YOU DEPLOYED FRONTEND ON RENDER, USE THIS URL INSTEAD**
  
  // This allows you to still test locally
  'http://localhost:3000' 
];

// --- 2. CONFIGURE THE CORS MIDDLEWARE ---
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the incoming request's URL is on our guest list
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // If it is, allow the request
      callback(null, true);
    } else {
      // If it is not, block the request with a CORS error
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    }
  }
};

// --- 3. APPLY THE NEW CORS CONFIGURATION ---
app.use(cors(corsOptions));
app.use(express.json());

// --- Cloudinary and Multer Configuration (No change here) ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({ cloudinary, params: { folder: 'anti-ragging-reports' } });
const upload = multer({ storage });

// --- Database Connection (No change here) ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- API Routes (No change here) ---
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');

app.post('/api/upload', upload.single('evidence'), (req, res) => {
  if (!req.file) return res.status(400).send({ message: 'No file uploaded.' });
  res.send({ filePath: req.file.path });
});
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});