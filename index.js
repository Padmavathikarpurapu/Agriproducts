// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb+srv://admin:admin@mernwebsite.edse9sr.mongodb.net/?retryWrites=true&w=majority&appName=MernWebSite', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define a simple user schema
const User = mongoose.model('User', {
  firstName: String,
  lastName: String,
  phoneNumber: String,
  email: String,
  password: String,
});

// Endpoint to handle user registration
app.post('/register', async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.json({ success: false, message: 'Email already registered' });
    } else {
      // Create a new user in the database
      const newUser = new User({ firstName, lastName, phoneNumber, email, password });
      await newUser.save();

      res.json({ success: true, message: 'Registration successful' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Endpoint to handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user in the database based on the provided username
    const user = await User.findOne({ email: username });

    if (!user) {
      // User not found
      res.json({ success: false, message: 'User not found' });
    } else {
      // Check if the provided password matches the stored password
      if (user.password === password) {
        // Passwords match, login successful
        res.json({ success: true, message: 'Login successful', user });
      } else {
        // Passwords do not match
        res.json({ success: false, message: 'Incorrect password' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
