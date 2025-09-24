// backend/server.js

const express = require('express');
const path = require('path'); // Import the 'path' module for handling file paths
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer'); // Import multer for file uploads
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- SERVE STATIC FILES ---
// This line makes the 'uploads' folder publicly accessible
// The URL will be http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- CONNECT TO DATABASE ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- MULTER FILE UPLOAD CONFIGURATION ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // The folder where files will be stored
  },
  filename: function (req, file, cb) {
    // Create a unique filename (timestamp + original name) to prevent files with the same name from overwriting each other
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// --- API ROUTES ---
// Import the route files
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');

// --- NEW UPLOAD ENDPOINT ---
// This route will handle the file upload itself
app.post('/api/upload', upload.single('evidence'), (req, res) => {
  // 'evidence' is the key we'll use in our frontend form data
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }
  // When multer processes the file, it adds a 'file' object to the request.
  // We send back the path to the file so the frontend knows where it is.
  res.send({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`
  });
});

// Use the main API routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});