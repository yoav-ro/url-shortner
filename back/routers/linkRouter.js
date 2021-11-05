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

//Loading an existing short link
linkRouter.get("/:url", (req, res) => {
    const longUrl = fileHelper.getFullUrl(req.params.url, req.headers.username);
    //res.send(longUrl)
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
        fullUrl: inputLink,
        id: shortId.generate(),
        timesViewed: 0,
        userName: username,
    };
    return urlObj;
}


module.exports = linkRouter;