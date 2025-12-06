// =========================
// Runtime Message Listener
// =========================
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    // =========================
    // Inject Voice Recognition Scripts
    // =========================
    if (msg.action === "inject_voice") {

        // Inject content scripts into the target tab
        chrome.scripting.executeScript({
            target: { tabId: msg.tabId },
            files: ["voiceRec.js", "actions.js"]
        });

        sendResponse({ success: true });

        // Forward command to the content script
        const targetTabId = msg.tabId;

        chrome.tabs.sendMessage(
            targetTabId,
            {
                command: "inject_voice",
                payload: msg.data
            },
            (response) => {
                sendResponse({ success: true, contentResponse: response });
            }
        );

        return true;
    }


    // =========================
    // Stop Voice Recognition
    // =========================
    else if (msg.action === "stop_voice") {

        const targetTabId = msg.tabId;

        chrome.tabs.sendMessage(
            targetTabId,
            {
                command: "stop_voice",
                payload: msg.data
            },
            (response) => {
                sendResponse({ success: true, contentResponse: response });
            }
        );

        return true;
    }
});
