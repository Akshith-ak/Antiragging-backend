const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. DEFINE YOUR "GUEST LIST" (ALLOWED ORIGINS) ---
// We will now also check if the origin is a Render URL.
const allowedOrigins = [
  'https://akshith-ak.github.io', // Your GitHub Pages URL
  'http://localhost:3000'         // For local development
];

// --- 2. CONFIGURE THE CORS MIDDLEWARE WITH A MORE FLEXIBLE CHECK ---
const corsOptions = {
  origin: function (origin, callback) {
    // The '!origin' part allows requests from tools like Postman that don't have an origin.
    // The 'origin.endsWith('.onrender.com')' check allows any subdomain from Render.
    if (allowedOrigins.indexOf(origin) !== -1 || !origin || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
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