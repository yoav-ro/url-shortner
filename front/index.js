const urlInput = document.getElementById("linkInput")
const submitUrlBtn = document.getElementById("submitLinkBtn");

submitUrlBtn.addEventListener("click", () => { addNewUrl() })

//localhost: "http://localhost:3000/"

function addNewUrl() {
    if (urlInput.value) {
        sendNewUrl(urlInput.value)
    }
    else {
        alert("No url entered!")
    }
}

function sendNewUrl(inputUrl) {
    const response = axios.post(`http://localhost:3000/link/create`, { longUrl: inputUrl })
    console.log(response)
}

