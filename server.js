// backend/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- FINAL Production CORS Policy ---
const allowedOrigins = [
  'https://akshith-ak.github.io', // Your live GitHub Pages URL
  'http://localhost:3000'         // For local development
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// --- Cloudinary and Multer Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({ cloudinary, params: { folder: 'anti-ragging-reports', resource_type: 'auto' } });
const upload = multer({ storage });

// --- Database and API Routes ---
mongoose.connect(process.env.MONGO_URI).then(() => console.log('✅ MongoDB connected')).catch(err => console.error('❌ DB Error:', err));

const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');

app.post('/api/upload', upload.single('evidence'), (req, res) => {
  if (!req.file) return res.status(400).send({ message: 'No file uploaded.' });
  res.send({ filePath: req.file.path });
});
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));