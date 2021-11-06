const express = require("express");
const path = require("path");
const shortId = require("shortid");
const fileHelper = require("../filehelper.js")

const linkRouter = express.Router();

//Creating a new short link
linkRouter.post("/create", (req, res) => {
    const longUrl = req.body.longUrl;
    const userName = req.body.username;
    const urlObj = createLinkObj(longUrl, userName)
    const shortUrl = req.protocol + "://" + req.get("host") + "/link/" + urlObj.id
    res.send(shortUrl)
    fileHelper.addUrlToDB(urlObj);
})

linkRouter.get("/shortUrl/:id", (req, res) => {
    const shortUrl = req.protocol + "://" + req.get("host") + "/link/" + req.params.id
    res.send(shortUrl)
})

linkRouter.get("/check/:id", (req, res) => {
    const id = req.params.id;
    if (fileHelper.doesUrlExist(id)) {
        res.send(false);
    }
    else {
        res.send(true);
    }
})

//Handles shortning a link with a custom id
linkRouter.post("/create/:customId", (req, res, next) => {
    const customId = req.params.customId;
    if (!fileHelper.doesUrlExist(customId)) {
        const longUrl = req.body.longUrl;
        const userName = req.body.username;
        const urlObj = createLinkObj(longUrl, userName);
        urlObj.id = customId;
        const shortUrl = req.protocol + "://" + req.get("host") + "/link/" + urlObj.id;
        res.send(shortUrl)
        fileHelper.addUrlToDB(urlObj)
    }
    else {
        res.status(406).json({ message: `ID ${id} is already taken!` })
    }
})

//Loading an existing short link
linkRouter.get("/:url", (req, res) => {
    const longUrl = fileHelper.getFullUrl(req.params.url, req.headers.username);
    if (longUrl === 404) {
        res.status(404).send(`Error! URL doesnt exist`)
    }
    res.redirect(longUrl)
})

//Returns all the urls added by a user
linkRouter.get("/user/:userName", (req, res) => {
    const userName = req.params.userName;
    console.log(userName)
    console.log("test")
    const urlsByUser = fileHelper.getUrlsByUser(userName);
    res.send("test");
})

//Create a link object
function createLinkObj(inputLink, username) {
    const urlObj = {
        originalUrl: inputLink,
        id: shortId.generate(),
        redirectCount: 0,
        userName: username,
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