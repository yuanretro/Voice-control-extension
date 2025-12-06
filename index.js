// =========================
// Element References
// =========================
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusText = document.getElementById("statusText");


// =========================
// Chrome Runtime Messaging
// =========================

// Start voice recognition in tab
document.getElementById("startBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    chrome.runtime.sendMessage(
        {
            action: "inject_voice",
            tabId: tab.id
        },
        function(response) {
            if (chrome.runtime.lastError) {
                console.error("Voice recognition start failed: ", chrome.runtime.lastError.message);
            } else if (response && response.success === true) {
                console.log("Voice recognition successfully started: ", response);
            } else {
                console.error("Voice recognition start failed: ", response);
            }
        }
    );
});

// Stop voice recognition in tab
document.getElementById("stopBtn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    chrome.runtime.sendMessage(
        {
            action: "stop_voice",
            tabId: tab.id
        },
        function(response) {
            if (chrome.runtime.lastError) {
                console.error("Voice recognition stop failed: ", chrome.runtime.lastError.message);
            } else if (response && response.success === true) {
                console.log("Voice recognition successfully stopped: ", response);
            } else {
                console.error("Voice recognition stop failed: ", response);
            }
        }
    );
});


// =========================
// Local Recognition Controls
// =========================

startBtn.addEventListener("click", () => {
    recognition.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;

    statusText.textContent = "Listening…";
    statusText.className = "status-value status-listening";
});

stopBtn.addEventListener("click", () => {
    recognition.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;

    statusText.textContent = "Stopped";
    statusText.className = "status-value status-stopped";
});


// =========================
// Recognition State Handling
// =========================

recognition.onend = () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;

    statusText.textContent = "Idle";
    statusText.className = "status-value status-idle";
};
