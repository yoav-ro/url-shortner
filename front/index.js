const urlInput = document.getElementById("linkInput")
const submitUrlBtn = document.getElementById("submitLinkBtn");
const userNameInput = document.getElementById("userNameInput");
const userInputBtn = document.getElementById("submitUserBtn");

submitUrlBtn.addEventListener("click", () => { addNewUrl() })
userInputBtn.addEventListener("click", () => { userRegister() })

let currUser = "";
const baseURL = "http://localhost:3000"

function addNewUrl(event) {
    if (urlInput.value) {
        sendNewUrl(urlInput.value, currUser)
        document.getElementById("resultDiv").innerHTML = "";
    }
    else {
        alert("No url entered!")
    }
}

function getCopyBtn(textToCopy) {
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy URL"
    copyBtn.addEventListener("click", (e) => { navigator.clipboard.writeText(textToCopy) })
    return copyBtn;
}

function userRegister() {
    if (userNameInput.value) {
        if (currUser === "") {
            currUser = userNameInput.value;
            domLogin();
        }
        else {
            alert("User already logged in!")
        }
    }
    else {
        alert("No user entered!")
    }
}

function domLogin() {
    const disconnectBtn = document.createElement("button");
    disconnectBtn.id = "disconnectBtn";
    disconnectBtn.textContent = "Disconnect"
    document.body.append(disconnectBtn)
    userNameInput.readOnly = true;
    userNameInput.value = `Welcome ${currUser}`
    disconnectBtn.addEventListener("click", () => { disconnect() })
    domUserInfo(currUser);
}

function disconnect() {
    currUser = "";
    userNameInput.readOnly = false;
    userNameInput.value = "";
    document.getElementById("disconnectBtn").remove();
    document.getElementById("userInfoDiv").innerHTML = "";
}

function sendNewUrl(inputUrl, userName) {
    const data = { longUrl: inputUrl, username: userName }
    const response = axios.post(`${baseURL}/link/create`, data)
    response.then((value) => {
        addResultEl(value.data)
    })
}


function addResultEl(shortUrl) {
    const resultDiv = document.getElementById("resultDiv");

    const copyBtn = getCopyBtn(shortUrl);

    const resultText = document.createElement("div");
    resultText.textContent = `Your shortened URL is: ${shortUrl}`;

    resultDiv.append(resultText)
    resultDiv.append(copyBtn)
}

function getUrlsByUser(userName) {
    const response = axios.get(`${baseURL}/link/user/${userName}`)
    return response;
}

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

function buildUrlEl(urlObj, urlNum) {
    const shortUrl = baseURL + "/link/" + urlObj.id
    const urlEl = document.createElement("div")
    urlEl.textContent = `URL ${urlNum}:`;
    const idDiv = document.createElement("div")
    idDiv.textContent = `ID: ${urlObj.id}`;
    const fullUrlDiv = document.createElement("div")
    fullUrlDiv.textContent = `Full URL: ${urlObj.fullUrl}`;
    const viewCountDiv = document.createElement("div")
    viewCountDiv.textContent = `Times clicked: ${urlObj.timesViewed}`;
    const shortUrlDiv= document.createElement("div");
    shortUrlDiv.textContent= `Shortened URL: ${shortUrl}`;
    
    const copyBtn= getCopyBtn(baseURL + "/link/" + urlObj.id)
    urlEl.append(idDiv);
    urlEl.append(fullUrlDiv);
    urlEl.append(viewCountDiv);
    urlEl.append(shortUrlDiv)
    urlEl.append(copyBtn)
    return urlEl;
}
