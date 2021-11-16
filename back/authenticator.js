const jwt = require("jsonwebtoken")
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).send("No token provided")
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            res.status(403).send("Unauthorized user!")
        }
        next();
    })
}

module.exports = authenticateToken;