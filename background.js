chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "inject_voice") {
        chrome.scripting.executeScript({
            target: { tabId: msg.tabId },
            files: ["voiceRec.js", "actions.js"]
        });
        sendResponse({ success: true });
        const targetTabId = msg.tabId;
        chrome.tabs.sendMessage(targetTabId, {
            command: "inject_voice",
            payload: msg.data
        }, (response) => {
            sendResponse({ success: true, contentResponse: response });
        });
        return true;
    } else if (msg.action === "stop_voice") {
        const targetTabId = msg.tabId;
        chrome.tabs.sendMessage(targetTabId, {
            command: "stop_voice",
            payload: msg.data
        }, (response) => {
            sendResponse({ success: true, contentResponse: response });
        });
        return true;
    }
});
