const express = require("express");
const path = require("path");
const shortId = require("shortid");
const fileHelper = require("../filehelper.js")
const validateId = require("../middleware/validateId.js")

const linkRouter = express.Router();
linkRouter.use(validateId)

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

//
linkRouter.post("/create/:customId", (req, res, next) => {
    const customId = req.params.customId;
    if (validateId(customId, req, res, next)) {
        console.log("id is free")
        const longUrl = req.body.longUrl;
        const userName = req.body.username;
        const urlObj = createLinkObj(longUrl, userName);
        urlObj.id = customId;
        const shortUrl = req.protocol + "://" + req.get("host") + "/link/" + urlObj.id;
        res.send(shortUrl)
        fileHelper.addUrlToDB(urlObj)
    }
})

//Loading an existing short link
linkRouter.get("/:url", (req, res) => {
    const longUrl = fileHelper.getFullUrl(req.params.url, req.headers.username);
    res.redirect(longUrl)
})

//Returns all the urls added by a user
linkRouter.get("/user/:userName", (req, res) => {
    const userName = req.params.userName;
    const urlsByUser = fileHelper.getUrlsByUser(userName);
    res.send(urlsByUser);
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

function getCurrDate() {
    const currentdate = new Date();
    const ret = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return ret;
}

module.exports = linkRouter;