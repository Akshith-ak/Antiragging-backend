// backend/models/Report.js

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    minLength: 50,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  location: {
    type: String,
  },
  severity: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'Pending',
  },
  // --- NEW FIELD ---
  // This will store the path to the uploaded file, e.g., '/uploads/1663958400000-evidence.jpg'
  evidenceUrl: {
    type: String, // Stored as a string (the URL path)
    default: '', // Defaults to an empty string if no file is uploaded
  },
  actionTaken: {
    type: String,
    default: '', 
  },
}, {
  timestamps: true,
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;