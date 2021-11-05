const fs = require("fs");
const path = require("path");

//Adds a new url to the database;
function addUrlToDB(urlObj) {
    const path = getUrlPath(urlObj.id)
    fs.writeFileSync(path, JSON.stringify(urlObj))
}

//Return the full url of a given short url if it exist and updates its view count
function getFullUrl(id) {
    if (doesUrlExist(id)) {
        const linkPath = getUrlPath(id)
        const urlObj = JSON.parse(fs.readFileSync(linkPath));
        linkViewed(linkPath);
        return urlObj.fullUrl;
    }
    throw "URL doesnt exist!";
}

//Updates the views counter of the given link
function linkViewed(linkPath) {
    const urlObj = JSON.parse(fs.readFileSync(linkPath));
    urlObj.timesViewed++;
    fs.unlinkSync(linkPath)
    fs.writeFileSync(linkPath, JSON.stringify(urlObj))
}

//Checks if url exist
function doesUrlExist(id) {
    const generalDirs = fs.readdirSync(path.resolve(__dirname, "./db"));
    for (let i = 0; i < generalDirs.length; i++) {
        const fileName = generalDirs[i].slice(0, generalDirs[i].length - 5)
        if (fileName === id) {
            return true;
        }
    }
    return false;
}

//Return the path to a given url 
function getUrlPath(id) {
    return path.resolve(__dirname, `./db/${id}.json`);
}

//Returns all the links added by a given user
function getUrlsByUser(userName) {
    const dbPath = path.resolve(__dirname, "./db");
    const urlDir = fs.readdirSync(dbPath);
    const urls = [];
    for (let i = 0; i < urlDir.length; i++) {
        urls.push(checkUser(urlDir[i], userName));
    }
    const urlsToReturn = urls.filter(Boolean);
    return urlsToReturn;
}

//Checks if a given url was added by the given user
function checkUser(url, userName) {
    const urlPath = path.resolve(__dirname, `./db/${url}`)
    const urlObj = JSON.parse(fs.readFileSync(urlPath));
    if (urlObj.userName === userName) {
        return urlObj;
    }
}

module.exports = {
    addUrlToDB,
    getFullUrl,
    getUrlsByUser,
}