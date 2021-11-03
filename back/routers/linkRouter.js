const express = require("express");
const path = require("path");
const shortId = require("shortid");
const fileHelper= require("../filehelper.js")

const linkRouter = express.Router();

//".../create/link/:linkgoogle.com"
linkRouter.get("/create/:url", (req, res) => {
    if(req.headers.username){
        const urlObj= createLinkObj(req.params.url, req.headers.username)
    }
    else{
        const urlObj= createLinkObj(req.params.url)       
    }
    fileHelper.addUrlToDB(urlObj);
})

linkRouter.get("/:url", (req,res)=>{ //Check if req.header.username throws or returns undefined
    if(req.headers.username){
        fileHelper.getFullUrl(req.params.url, req.headers.username);
    }
    else{
        fileHelper.getFullUrl(req.params.url);
        //get url without user
    }
})

function createLinkObj(inputLink, username) {
    // times, longlink, id (shortlink), user (?)
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