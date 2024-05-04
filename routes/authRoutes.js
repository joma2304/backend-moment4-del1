const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Anslut till MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connectiong to database...");
});

// User model
const User = require("../models/User");

// Middleware för att verifiera JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
}

// Lägg till ny användare
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password" });
        }

        // Spara användare om rätt
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: "User created" });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Logga in
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password" });
        }

        // Kolla efter användare
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Incorrect username/password!" });
        }

        // Kolla lösenord
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Incorrect username/password!" });
        } else {
            // Skapa JWT
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });
            const response = {
                message: "User logged in!",
                token: token
            }
            res.status(200).json({ response });
        }

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Skyddad route
router.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "Skyddad route!" });
});

module.exports = router;
