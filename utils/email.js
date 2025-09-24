const nodemailer = require('nodemailer');
require('dotenv').config();

const sendNewReportNotification = (report) => {
  // 1. Create a "transporter" - the service that will send the email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    // --- THIS IS THE FIX ---
    // This option tells Node.js to ignore self-signed certificate errors.
    // This is often needed when behind a corporate firewall or antivirus.
    tls: {
      rejectUnauthorized: false
    }
  });

  // 2. Define the email's content (No change here)
  const mailOptions = {
    from: `"Anti-Ragging Portal" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Incident Report Submitted - Severity: ${report.severity}`,
    html: `
      <h2>A new incident report has been submitted.</h2>
      <p><strong>Report ID:</strong> ${report._id.toString().slice(-8).toUpperCase()}</p>
      <p><strong>Severity:</strong> ${report.severity}</p>
      <p><strong>Location:</strong> ${report.location || 'Not specified'}</p>
      <hr>
      <p><strong>Description:</strong></p>
      <p>${report.description}</p>
      <hr>
      <p>Please log in to the admin dashboard to review the full details and take action.</p>
    `,
  };

  // 3. Send the email (No change here)
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error('Error sending email:', error);
    }
    console.log('✅ Notification email sent:', info.response);
  });
};

module.exports = { sendNewReportNotification };

