const express = require("express");
const path = require("path");
const shortId = require("shortid");
const fileHelper = require("../filehelper.js")

const linkRouter = express.Router();

//Creating a new short link
linkRouter.post("/create", (req, res) => {
    const longUrl = req.body.longUrl;
    const urlObj = createLinkObj(longUrl, req.headers.username)
    fileHelper.addUrlToDB(urlObj);
})

//Loading an existing short link
linkRouter.get("/:url", (req, res) => {
    const longUrl = fileHelper.getFullUrl(req.params.url, req.headers.username);
    res.send(longUrl)
    res.redirect(longUrl)
})

//Create a link object
function createLinkObj(inputLink, username) {
    const urlObj = {
        fullUrl: inputLink,
        id: shortId.generate(),
        timesViewed: 0,
    };
    if (username) {
        urlObj.userName = username;
    }
    return urlObj;
}

module.exports = linkRouter;