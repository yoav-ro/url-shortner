const Link = require("./models/linkModel");
const mongoose = require("mongoose");
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

mongoose.connect(process.env.DATA_BASE, { useNewUrlParser: true, })

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected!")
})

async function addLinkToDB(linkObj) {
    const link = new Link(linkObj);
    await link.save();
}

async function isCustomFree(shortUrl) {
    const link = await Link.findOne({ token: shortUrl })
    if (link) {
        return false;
    }
    else {
        return true;
    }
}

async function getUrlsByUser(userName, res) {
    const links = await Link.find({ username: userName });
    res.send(links);
}

async function redirect(shortUrl, res) {
    const link = await Link.findOneAndUpdate({ token: shortUrl }, { $inc: { redirectCount: 1 } })
    if (link) {
        res.redirect(link.originalUrl)
    }
    else {
        res.status(404).send(`Error! URL doesnt exist`)
    }
}

module.exports = { addLinkToDB, isCustomFree, redirect, getUrlsByUser }