const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Signup controller
exports.signup = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    // Check if email exists (case-insensitive)
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered. Please use a different email or try logging in.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword, role });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, fullName, email, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if user type matches
    if (userType && user.role.toLowerCase() !== userType.toLowerCase()) {
      return res.status(400).json({ 
        message: `Incorrect user type selected. You are registered as an ${user.role}.`
      });
    }

    const token = generateToken(user._id);
    res.status(200).json({ token, user: { id: user._id, fullName: user.fullName, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user info from token
exports.getMe = async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
