const fs = require("fs");
const { url } = require("inspector");
const path = require("path");
const path = require("path/posix");

//Adds a new url to the database;
function addUrlToDB(urlObj) {
    if (urlObj.userName) {
        const path = getUserPath(urlObj.userName) + `/${urlObj.id}.json`;
        fs.writeFileSync(path, JSON.stringify(urlObj))
    }
    else {
        const path = getGeneralPath() + `/${urlObj.id}.json`;
        fs.writeFileSync(path, JSON.stringify(urlObj))
    }
}

function getFullUrl(id, username) {
    if (doesUrlExist(id)) {
        if (username) {
            const userPath = getUserPath(username) + `/${id}.json`;
            const urlObj = fs.readFileSync(userPath);
            return urlObj.fullUrl;
        }
        else{
            const generalPath= getGeneralPath(id) + `/${id}.json`;
            const urlObj = fs.readFileSync(generalPath);
            return urlObj.fullUrl;
        }
    }
    throw "URL doesnt exist!";
}

function doesUrlExist(id) {
    if (doesUrlExistUser(id) || doesUrlExistGeneral(id)) {
        return true;
    }
    return false;
}

function doesUrlExistUser(id) {
    const usersDirs = fs.readdirSync(path.resolve(__dirname, `./db/users`));
    for (let i = 0; i < usersDirs.length; i++) {
        const userLinks = fs.readdirSync(getUserPath(usersDirs[i]));
        for (let j = 0; j < userLinks.length; j++) {
            if (userLinks[j] === id) {
                return true;
            }
        }
    }
    return false;
}

function doesUrlExistGeneral(id) {
    const generalDirs = fs.readdirSync(getGeneralPath());
    for (let i = 0; i < generalDirs.length; i++) {
        if (generalDirs[i] === id) {
            return true;
        }
    }
    return false;
}


function getGeneralPath() {
    return path.resolve(__dirname, `./db/general`);
}

//Gets the path to a given user's folder
function getUserPath(username) {
    if (doesUserDirExist(username)) {
        return path.resolve(__dirname, `./db/users/${username}`);
    }
    else {
        createUserDir(username);
        return path.resolve(__dirname, `./db/users/${username}`);
    }
}

//Creates a user folder under ./users
function createUserDir(userName) {
    fs.mkdirSync(getUserPath(userName));
}

//Checks if a user's folder exists
function doesUserDirExist(userName) {
    if (fs.existsSync(getUserPath(userName))) {
        return true;
    }
    return false;
}

module.exports = {
    addUrlToDB,
    getFullUrl,
}