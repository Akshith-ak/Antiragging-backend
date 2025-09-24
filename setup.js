// backend/setup.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

// --- ADMIN CREDENTIALS TO BE CREATED ---
const ADMIN_EMAIL = 'akshith@college.edu';
const ADMIN_PASSWORD = 'Akshith@123'; 

const setupAdmin = async () => {
  try {
    // 1. Connect to the database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully.');

    // 2. Check if the admin user already exists
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists. No action taken.');
      return; // Exit if the user is already there
    }

    // 3. If admin does not exist, create a new one
    console.log('Admin user not found. Creating a new one...');
    const admin = new Admin({
      email: ADMIN_EMAIL,
    });

    // 4. Hash the password securely
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // 5. Save the new admin to the database
    await admin.save();
    console.log('🎉 Admin user created successfully!');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);

  } catch (err) {
    console.error('❌ Error during setup:', err.message);
  } finally {
    // 6. Disconnect from the database
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

// Run the setup function
setupAdmin();