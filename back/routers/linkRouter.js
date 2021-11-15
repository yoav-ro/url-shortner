const express = require("express");
const path = require("path");
const shortId = require("shortid");

const linkRouter = express.Router();

const linkHelper = require("../linkHelper");

//Creating a new short link
linkRouter.post("/create", (req, res) => {
    const longUrl = req.body.longUrl;
    const userName = req.body.username;
    const urlObj = createLinkObj(longUrl, userName)
    const shortUrl = req.protocol + "://" + req.get("host") + "/link/" + urlObj.token
    linkHelper.addLinkToDB(urlObj);
    res.send(shortUrl)
})

linkRouter.get("/shortUrl/:token", (req, res) => {
    const shortUrl = req.protocol + "://" + req.get("host") + "/link/" + req.params.token
    res.send(shortUrl)
})

linkRouter.get("/check/:token", (req, res) => {
    const token = req.params.token;
    linkHelper.isCustomFree(token).then((value) => {
        if (value === true) {
            res.send(true)
        }
        else {
            res.send(false)
        }
    })
})

//Handles shortning a link with a custom short end
linkRouter.post("/create/:token", (req, res) => {
    const token = req.params.token;
    linkHelper.isCustomFree(token).then((value) => {
        if (value === true) {
            const longUrl = req.body.longUrl;
            const username = req.body.username;
            const urlObj = createLinkObj(longUrl, username);
            urlObj.token = token;
            const shortUrl = req.protocol + "://" + req.get("host") + "/link/" + urlObj.token;
            res.send(shortUrl)
            linkHelper.addLinkToDB(urlObj)
        }
        else {
            res.status(406).json({ message: `Short end ${token} is already taken!` })
        }
    })
})

//Loading an existing short link
linkRouter.get("/:url", (req, res) => {
    linkHelper.redirect(req.params.url, res);
})

//Returns all the urls added by a user
linkRouter.get("/user/:userName", (req, res) => {
    const userName = req.params.userName;
    linkHelper.getUrlsByUser(userName, res);
})

//Create a link object
function createLinkObj(inputLink, username) {
    const urlObj = {
        originalUrl: inputLink,
        token: shortId.generate(),
        redirectCount: 0,
        username: username,
        creationDate: getCurrDate(),
    };
    return urlObj;
}

//Returns a string of current date and time
function getCurrDate() {
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const timeStr = `${today.getHours()}:${checkTime(today.getMinutes())}:${checkTime(today.getSeconds())}`;
    const fullDateTime = `${timeStr} ${dateStr}`;
    return fullDateTime;
}

// Addes 0 in front of numbers
function checkTime(i) {
    if (i < 10) { i = `0${i}`; } // add zero in front of numbers < 10
    return i;
}

module.exports = linkRouter;