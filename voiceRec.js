// =========================
// Speech Recognition Setup
// =========================
var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
var ifStarted = false;

recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;


// =========================
// Message Listeners
// =========================

// Start voice recognition
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command === "inject_voice") {
        if (ifStarted) {
            console.log("Speech recognition already started");
            return;
        } else {
            recognition.start();
            ifStarted = true;
            console.log("Speech recognition started", msg.payload);
        }

        sendResponse({ status: "processed", result: "ok" });
        return true;
    }
});

// Stop voice recognition
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command === "stop_voice") {
        console.log("Speech recognition stopped by user", msg.payload);
        recognition.stop();
        sendResponse({ status: "processed", result: "ok" });
        return true;
    }
});


// =========================
// Recognition Result Handler
// =========================
var previousTranscript = "";

recognition.onresult = (event) => {
    const currentResult = event.results[event.results.length - 1];
    const currentTranscript = currentResult[0].transcript;

    if (currentTranscript.length > previousTranscript.length) {
        const newPart = currentTranscript.substring(previousTranscript.length).trim();
        if (newPart) {
            console.log(newPart);
            action(newPart);
        }
    }

    previousTranscript = currentTranscript;

    if (currentResult.isFinal) {
        previousTranscript = "";
    }
};


// =========================
// Error & End Handlers
// =========================
recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
};

recognition.onend = () => {
    console.log('Speech recognition ended');
    ifStarted = false;
};
