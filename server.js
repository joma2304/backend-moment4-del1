const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const path = require("path"); 
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

//Routes
app.use("/api", authRoutes);

//validera token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Token

    if(token == null) return res.redirect("/login"); // Omdirigera till inloggningssidan om JWT-token saknas

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if(err) return res.redirect("/login"); // Omdirigera till inloggningssidan om JWT-token är ogiltigt

        req.username = username;
        next();
    });
}

//Skyddad route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "protected.html"))
});

//Starta app
app.listen(port, () => {
    console.log("Server startad på port: " + port);
});