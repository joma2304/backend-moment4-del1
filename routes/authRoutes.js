//Routes för auth

const express = require("express");
const router = express.Router();

//Lägg till ny användare
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        //validera input
        if(!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password"});
        }

        //Spara användare ifall rätt
        res.status(201).json({ message: "User created"});

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

//Logga in
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        //validera input
        if(!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password"});
        }

        //Kolla så att det stämmer
        if(username === "johan" && password === "password") {
            res.status(200).json({ message: "Login successful"});
        } else {
            res.status(401).json({ error: "Invalid username/password"});
        }

    } catch (error) {
        res.status(500).json({ error: "Server error"});
    }
});

module.exports = router;