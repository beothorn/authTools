chrome.devtools.panels.create("AuthTools",
    "icon.png",
    "devtools.html",
    function(panel) {
        console.log("AutTools was loaded");
    }
);

function addEntry(title, details) {
    const entries = document.getElementById("entries");
    const entry = document.createElement("div");
    const titleElement = document.createElement("p");
    titleElement.innerText = title;    
    entry.appendChild(titleElement);
    const oauthDetails = document.createElement("pre");
    oauthDetails.innerText = details;
    entry.appendChild(oauthDetails);
    // set element class
    entry.classList.add("entry");
    entries.appendChild(entry);
}

function getDomain(details) {
    let domain = details.url.split('/');
    return `${domain[0]}/${domain[1]}/${domain[2]}`;
}

function getParams(details){
    const query = details.url.split('?')[1];
    const params = Object.fromEntries(new URLSearchParams(query));
    return JSON.stringify(params, null, 2);
}

chrome.webRequest.onBeforeRedirect.addListener(
    (details) => {
        const isOauthResponse = details.statusCode === 302 && details.url.includes('code');
        if (isOauthResponse) {
            const title = `Returning code from ${details.initiator} to ${getDomain(details)}`;
            addEntry(title, getParams(details));
        }
    },
    {urls: ["<all_urls>"]}
)

chrome.webRequest.onCompleted.addListener(
    (details) => {
        const isOauthRequest = details.url.includes('redirect_uri');
        if (isOauthRequest) {
            const title = `Request from ${details.initiator} to ${getDomain(details)}`;
            addEntry(title, getParams(details));
        }
    },
    {urls: ["<all_urls>"]}
)