
const urlInput = document.getElementById("linkInput")
const submitUrlBtn = document.getElementById("submitLinkBtn");
const userNameInput = document.getElementById("userNameInput");
const userInputBtn = document.getElementById("submitUserBtn");
const disconnectBtn = document.getElementById("disconnectBtn");

submitUrlBtn.addEventListener("click", () => { addNewUrl() })
userInputBtn.addEventListener("click", () => { userRegister() })
disconnectBtn.addEventListener("click", () => { domDisconnect() })

const validator = require("validator")

import "./index.css";

let currUser = "";
const baseURL = "http://localhost:3000"

//Requests a new url to be shortened
function addNewUrl() {
    const normalInput = document.getElementById("linkInput");
    const customInput = document.getElementById("customInput");
    if (normalInput.value) {
        if (validator.isURL(normalInput.value)) {
            if (customInput.value === "") {
                addNormalUrl(normalInput.value)
            }
            else {
                addCustomUrl(normalInput.value, customInput.value)
            }
        }
        else {
            alert("Invalid url!")
        }
    }
    else {
        alert("No url entered!")
    }
}

function addNormalUrl(urlToShorten) {
    sendNewUrl(urlToShorten, currUser)
    document.getElementById("resultDiv").innerHTML = "";
}

//Return a copy button, which will copy the given text to the clipboard
function getCopyBtn(textToCopy) {
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy URL"
    copyBtn.addEventListener("click", (e) => { navigator.clipboard.writeText(textToCopy) })
    return copyBtn;
}


//User loggin
function userRegister() {
    if (userNameInput.value) {
        currUser = userNameInput.value;
        domLogin();
    }
    else {
        alert("No user entered!")
    }
}


//Handles all elements related to a user when loggin in
function domLogin() {
    document.getElementById("customInput").style.display = "initial"
    userInputBtn.style.display = "none";
    disconnectBtn.style.display = "initial";
    userNameInput.readOnly = true;
    userNameInput.value = `Welcome ${currUser}`
    domUserInfo(currUser);
}

//Handles all the elements related to a user when disconnecting 
function domDisconnect() {
    document.getElementById("customInput").style.display = "none"
    userInputBtn.style.display = "initial";
    disconnectBtn.style.display = "none";
    currUser = "";
    userNameInput.readOnly = false;
    userNameInput.value = "";
    document.getElementById("disconnectBtn").remove();
    document.getElementById("userInfoDiv").innerHTML = "";
}

//Sends a new url to shorten
function sendNewUrl(inputUrl, userName) {
    const data = { longUrl: inputUrl, username: userName }
    const response = axios.post(`${baseURL}/link/create`, data)
    response.then((value) => {
        addResultEl(value.data)
    })
}

function sendNewCustomUrl(inputUrl, customId, userName) {
        const data = { longUrl: inputUrl, username: userName }
        const response = axios.post(`${baseURL}/link/create/${customId}`, data)
        response.then((value) => {
            addResultEl(value.data)
        })
        response.catch((value)=>{
            alert("ID already taken!")
        })
}

//Requests a new url to be shortened
function addCustomUrl(fullUrl, customId) {
    sendNewCustomUrl(fullUrl, customId, currUser)
    document.getElementById("resultDiv").innerHTML = "";
}

//Shows the result after shortning a new url
function addResultEl(shortUrl) {
    const resultDiv = document.getElementById("resultDiv");

    const copyBtn = getCopyBtn(shortUrl);

    const resultText = document.createElement("div");
    resultText.textContent = `Your shortened URL is: ${shortUrl}`;

    resultDiv.append(resultText)
    resultDiv.append(copyBtn)
}

//Returns a promise containing all urls by given user
function getUrlsByUser(userName) {
    const response = axios.get(`${baseURL}/link/user/${userName}`)
    return response;
}

//Maniplutes DOM to show all urls by a given user
function domUserInfo(userName) {
    const urlsPromise = getUrlsByUser(userName);
    const userInfoDiv = document.getElementById("userInfoDiv");
    urlsPromise.then((value) => {
        const urls = value.data;
        console.log(urls)
        for (let i = 0; i < urls.length; i++) {
            const urlEl = buildUrlEl(urls[i], i + 1)
            userInfoDiv.append(urlEl)
        }
    })
}

//Creates an element containing info about a url
function buildUrlEl(urlObj, urlNum) {
    const shortUrl = baseURL + "/link/" + urlObj.id
    const urlEl = document.createElement("li")
    urlEl.textContent = `URL ${urlNum}:`;
    urlEl.classList.add("urlInfo")
    const idDiv = document.createElement("div")
    idDiv.textContent = `ID: ${urlObj.id}`;
    const fullUrlDiv = document.createElement("div")
    fullUrlDiv.textContent = `Full URL: ${urlObj.originalUrl}`;
    const viewCountDiv = document.createElement("div")
    viewCountDiv.textContent = `Times clicked: ${urlObj.redirectCount}`;
    const shortUrlDiv = document.createElement("div");
    shortUrlDiv.textContent = `Shortened URL: ${shortUrl}`;
    const dateDiv = document.createElement("div");
    dateDiv.textContent = urlObj.creationDate;

    const copyBtn = getCopyBtn(baseURL + "/link/" + urlObj.id)
    urlEl.append(idDiv);
    urlEl.append(dateDiv);
    urlEl.append(viewCountDiv);
    urlEl.append(fullUrlDiv);
    urlEl.append(shortUrlDiv)
    urlEl.append(copyBtn)
    return urlEl;
}
