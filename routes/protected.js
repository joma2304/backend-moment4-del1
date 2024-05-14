const User = require("../models/User");

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../path/to/authenticateToken");
require("dotenv").config();

//Anslut till mongodb
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connectiong to database...");
});

router.get('/username', authenticateToken, async (req, res) => {
  try {
    // Använd användarnamnet från användaren
    const loggedInUsername = req.user.username;

    // Hämta den inloggade användaren baserat på användarnamnet
    const loggedInUser = await User.findOne({ username: loggedInUsername });

    // Om den inloggade användaren inte hittas
    if (!loggedInUser) {
      return res.status(404).json({ message: 'Inloggad användare hittades inte.' });
    }

    // Returnera den inloggade användaren
    return res.json(loggedInUser);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;