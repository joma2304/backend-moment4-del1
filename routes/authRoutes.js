//Routes för auth

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Anslut till mongodb
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connectiong to database...");
});

//User model
const User = require("../models/User");


//Lägg till ny användare
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        //validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password" });
        }

        //Spara användare ifall rätt
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: "User created" });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Logga in
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        //validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password" });
        }

        //KOlla efter användare
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Incorrect username/password!" });
        }

        //Kolla lösenord
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Incorrect username/password!" });
        } else {
            //Skapa JWT
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

module.exports = router;