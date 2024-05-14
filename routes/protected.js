const User = require("../models/User");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get('/username', async (req, res) => {
  try {
    // Hämta användarnamnet från JWT-tokenet
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid JWT token' });
      }
      const loggedInUsername = decoded.username;

      // Hämta den inloggade användaren baserat på användarnamnet
      const loggedInUser = await User.findOne({ username: loggedInUsername });

      // Om den inloggade användaren inte hittas
      if (!loggedInUser) {
        return res.status(404).json({ message: 'Inloggad användare hittades inte.' });
      }

      // Returnera den inloggade användaren
      return res.json(loggedInUser);
    });
  } catch (error) {
    console.error('An error occurred:', error); // Logga felet till konsolen
    return res.status(500).json({ message: 'An error occurred', error: error.message }); 
  }
});

module.exports = router;