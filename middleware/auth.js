const jwt = require('jsonwebtoken');
require('dotenv').config();

// This function will be our "guard"
module.exports = function (req, res, next) {
  // 1. Get the token from the request header
  const token = req.header('x-auth-token');

  // 2. Check if no token is provided
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify the token if it exists
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // If successful, add the admin's info to the request object
    req.admin = decoded.admin;
    next(); // Move on to the next piece of middleware or the route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
