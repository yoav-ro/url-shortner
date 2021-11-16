const submitUrlBtn = document.getElementById("submitLinkBtn");
const loginBtn = document.getElementById("submitUserBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const testCustomIdBtn = document.getElementById("testCustomId")
const registerBtn = document.getElementById("registerBtn")

submitUrlBtn.addEventListener("click", () => { addNewUrl() })
loginBtn.addEventListener("click", () => { userLogin(document.getElementById("userNameInput").value, document.getElementById("passwordInput").value) })
disconnectBtn.addEventListener("click", () => { domDisconnect() })
testCustomIdBtn.addEventListener("click", () => { isCusttomIdFree() })
registerBtn.addEventListener("click", () => { userRegister() })


// const validator = require("validator")

// import "./index.css";

let currUser = "";
const baseURL = "http://localhost:3000"

//Requests a new url to be shortened
function addNewUrl() {
    const normalInput = document.getElementById("linkInput");
    const customInput = document.getElementById("customInput");
    if (normalInput.value) { //Check if if a url was entered
        // if (validator.isURL(normalInput.value)) { //Validates the url
        if (customInput.value === "") { //Checks if a custom id was entered
            addNormalUrl(normalInput.value)
        }
        else {
            addCustomUrl(normalInput.value, customInput.value)
        }
        // }
        // else {
        //     alert("Invalid url!")
        // }
    }
    else {
        alert("No url entered!")
    }
}

//Sends a normal url to be added
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

//Checks if the custom url added is free
async function isCusttomIdFree() {
    const customInput = document.getElementById("customInput")
    const customId = customInput.value;
    if (customId) {
        document.getElementById("testCustomId").textContent = "🔃"
        const request = await axios.get(`${baseURL}/link/check/${customId}`, {
            headers: {
                "authorization": `Bearer ${getUserToken()}`
            }
        });
        if (request.data) {
            document.getElementById("testCustomId").textContent = "✔"
        }
        else {
            document.getElementById("testCustomId").textContent = "❌"
        }
        customInput.addEventListener("keypress", () => { testCustomIdBtn.textContent = "Check if useable" })
    }
    else {
        alert("No input detected!")
    }
}

function getUserToken() {
    const cookies = document.cookie.split("; ");
    for (cookie of cookies) {
        if (cookie.split("=")[0] === "userToken") {
            return cookie.split("=")[1]
        }
    }
}

//User login
function userLogin(userNameInput, passwordInput) {
    const resultLabel = document.getElementById("loginRes")
    if (userNameInput && passwordInput) {
        currUser = userNameInput;
        const response = axios.post(`${baseURL}/login`, { username: userNameInput, password: passwordInput })
        response.then((value) => {
            document.cookie = `userToken=${value.data}`
            domLogin();
        }).catch((value) => {
            resultLabel.style.display = "initial";
            resultLabel.textContent = value.response.data;
        })
    }
    else {
        alert("No user entered!")
    }
}

function userRegister() {
    const resultLabel = document.getElementById("loginRes")
    const userNameInput = document.getElementById("userNameInput")
    const passwordInput = document.getElementById("passwordInput")
    if (userNameInput.value && passwordInput.value) {
        const response = axios.post(`${baseURL}/register`, { username: userNameInput.value, password: passwordInput.value })
        response.then((value) => {
            console.log(value)
            userLogin(userNameInput.value, passwordInput.value)
        }).catch((value) => {
            resultLabel.style.display = "initial";
            resultLabel.textContent = value.response.data;
        })
    }
    else {
        alert("Missing input!")
    }
}


//Handles all elements related to a user when loggin in
function domLogin() {
    const userNameInput = document.getElementById("userNameInput")
    const passwordInput = document.getElementById("passwordInput")
    const resultLabel = document.getElementById("loginRes")
    document.getElementById("customInput").style.display = "initial"
    document.getElementById("baseLinkLabel").style.display = "initial"
    document.getElementById("testCustomId").style.display = "initial"
    document.getElementById("passwordInput").style.display = "none"
    passwordInput.style.display = "none"
    passwordInput.value = "";
    resultLabel.style.display = "none";
    resultLabel.textContent = "";
    registerBtn.style.display = "none";

    loginBtn.style.display = "none";
    disconnectBtn.style.display = "initial";
    userNameInput.readOnly = true;
    userNameInput.value = `Welcome ${currUser}`
    domUserInfo(currUser);
}

//Handles all the elements related to a user when disconnecting 
function domDisconnect() {
    console.log("removing cookie")
    document.cookie = `${document.cookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    const userNameInput = document.getElementById("userNameInput")
    const passwordInput = document.getElementById("passwordInput")
    document.getElementById("customInput").style.display = "none"
    document.getElementById("baseLinkLabel").style.display = "none"
    document.getElementById("testCustomId").style.display = "none"
    passwordInput.style.display = "initial"
    passwordInput.value = "";
    registerBtn.style.display = "initial";
    loginBtn.style.display = "initial";
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

//Send a request for a custom url link
function sendNewCustomUrl(inputUrl, customId, userName) {
    const data = { longUrl: inputUrl, username: userName }
    const response = axios.post(`${baseURL}/link/create/${customId}`, data) //add authorization header
    response.then((value) => {
        addResultEl(value.data)
    })
    response.catch((value) => {
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
    if (currUser !== "") {
        domUserInfo(currUser)
    }
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
    userInfoDiv.innerHTML = "";
    urlsPromise.then((value) => {
        const urls = value.data;
        for (let i = 0; i < urls.length; i++) {
            const urlEl = buildUrlEl(urls[i], i + 1)
            userInfoDiv.append(urlEl)
        }
    })
}

//Creates an element containing info about a url
function buildUrlEl(urlObj, urlNum) {
    const shortUrl = "http://link-cut.herokuapp.com/link/" + urlObj.token
    const urlEl = document.createElement("li")
    urlEl.textContent = `URL ${urlNum}:`;
    urlEl.classList.add("urlInfo")
    const idDiv = document.createElement("div")
    idDiv.textContent = `Token: ${urlObj.token}`;
    const fullUrlDiv = document.createElement("div")
    fullUrlDiv.textContent = `Full URL: ${urlObj.originalUrl}`;
    const viewCountDiv = document.createElement("div")
    viewCountDiv.textContent = `Times clicked: ${urlObj.redirectCount}`;
    const shortUrlDiv = document.createElement("div");
    shortUrlDiv.textContent = `Shortened URL: ${shortUrl}`;
    const dateDiv = document.createElement("div");
    dateDiv.textContent = `Creation date: ${urlObj.creationDate}`;

    const copyBtn = getCopyBtn(shortUrl)
    urlEl.append(idDiv);
    urlEl.append(dateDiv);
    urlEl.append(viewCountDiv);
    urlEl.append(fullUrlDiv);
    urlEl.append(shortUrlDiv)
    urlEl.append(copyBtn)
    return urlEl;
}
