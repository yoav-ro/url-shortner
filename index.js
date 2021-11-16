const express = require("express");
const cors = require("cors");
const path = require("path");
const linkRouter = require("./back/routers/linkRouter.js");
const userHelper = require("./back/userHelper")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
require("dotenv").config();


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(cookieParser())
app.use("/link", linkRouter)

app.use('/', express.static(path.resolve('./dist'))); // serve main path as static dir
app.get('/', (req, res) => { // serve main path as static file
    res.sendFile(path.resolve('./dist/index.html'))
});


app.get('/test', (req, res) => {
    res.cookie("test", "hello there").send("Cookie added")
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

app.post("/login", (req, res) => {
    const user = { username: req.body.username, password: req.body.password }
    console.log(user)
    userHelper.validateLogin(user.username, user.password).then((value) => {
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN);
        res.cookie("user", accessToken).send(accessToken)
    }).catch((err) => {
        res.status(403).send(err);
    })


})

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    userHelper.register(username, password).then((value) => {
        res.send("Registered!")
    }).catch((value) => {
        res.status(409).send("User name already exists")
    })
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1];
    if (token === null) return res.status(401).send("No token provided")
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            res.status(403).send("Invalid token")
        }
        req.user = user;
        next();
    })
}

