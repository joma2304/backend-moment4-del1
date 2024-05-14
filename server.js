const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const protected = require("./routes/protected");
const path = require("path"); 
require("dotenv").config();
const jwt = require("jsonwebtoken");


const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

//validera token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Token

    if(token== null) res.status(401).json({ message: "Not authorized for this route! - Token missing" });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if(err) return res.status(403).json({ message: "Invalid JWT"});

        req.username = username;
        next();
    });
}

//Routes
app.use("/api", authRoutes);

//Skyddad route
app.use("/api/protected", authenticateToken, protected);

//Starta app
app.listen(port, () => {
    console.log("Server startad på port: " + port);
});