// backend/routes/reports.js

const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');
const { sendNewReportNotification } = require('../utils/email'); // This path must be correct

// --- GET ALL REPORTS ---
router.get('/', auth, async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- POST a new report ---
router.post('/', async (req, res) => {
  try {
    const { description, date, time, location, severity, evidenceUrl } = req.body;
    const newReport = new Report({ description, date, time, location, severity, evidenceUrl });
    
    const report = await newReport.save();

    res.status(201).json(report);

    // After saving, send the notification email
    sendNewReportNotification(report);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- GET SINGLE REPORT ---
router.get('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ msg: 'Report not found' });
        res.json(report);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- UPDATE STATUS ---
router.put('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
        if (!updatedReport) return res.status(404).json({ msg: 'Report not found' });
        res.json(updatedReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- UPDATE ACTION TAKEN ---
router.put('/:id/action', auth, async (req, res) => {
    try {
        const { actionTaken } = req.body;
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, { $set: { actionTaken } }, { new: true });
        if (!updatedReport) return res.status(404).json({ msg: 'Report not found' });
        res.json(updatedReport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;