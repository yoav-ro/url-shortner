const urlInput = document.getElementById("linkInput")
const submitUrlBtn = document.getElementById("submitLinkBtn");
const userNameInput = document.getElementById("userNameInput");
const userInputBtn = document.getElementById("submitUserBtn");

submitUrlBtn.addEventListener("click", () => { addNewUrl() })
userInputBtn.addEventListener("click", () => { userRegister() })

let currUser = "";
//localhost: "http://localhost:3000/"

function addNewUrl(event) {
    if (urlInput.value) {
        sendNewUrl(urlInput.value, currUser)
        document.getElementById("resultDiv").innerHTML = "";
    }
    else {
        alert("No url entered!")
    }
}

function userRegister() {
    if (userNameInput.value) {
        currUser = userNameInput.value;
        domLogin();
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
}

function disconnect() {
    currUser = "";
    userNameInput.readOnly = false;
    userNameInput.value = "";
    document.getElementById("disconnectBtn").remove();
}

function sendNewUrl(inputUrl, userName) {
    const data = { longUrl: inputUrl, username: userName }
    const response = axios.post(`http://localhost:3000/link/create`, data)
    response.then((value) => {
        addResultEl(value.data)
    })
}


function addResultEl(shortUrl) {
    console.log(shortUrl)
    const resultDiv = document.getElementById("resultDiv");

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy URL"
    copyBtn.addEventListener("click", (e) => { navigator.clipboard.writeText(shortUrl) })

    const resultText = document.createElement("div");
    resultText.textContent = `Your shortened URL is: ${shortUrl}`;

    resultDiv.append(resultText)
    resultDiv.append(copyBtn)
}
