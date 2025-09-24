// backend/server.js

const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Use Render's port if available

app.use(express.json());

// --- CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:3000', // for local development
  'https://Akshith-ak.github.io' // your frontend GitHub Pages URL
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps or Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// --- SERVE STATIC FILES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- CONNECT TO DATABASE ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- MULTER FILE UPLOAD CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// --- UPLOAD ENDPOINT ---
app.post('/api/upload', upload.single('evidence'), (req, res) => {
  if (!req.file) return res.status(400).send({ message: 'No file uploaded.' });
  res.send({
    message: 'File uploaded successfully',
    filePath: `/uploads/${req.file.filename}`
  });
});

// --- MAIN API ROUTES ---
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
