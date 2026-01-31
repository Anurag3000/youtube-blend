chrome.storage.local.get("jwt", ({ jwt }) => {
  if (!jwt) {
    alert("Please login first");
    return;
  }

  uploadWithToken(jwt);
});

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (message.type === "YOUTUBE_BLEND_AUTH") {
      chrome.storage.local.set({ jwt: message.token }, () => {
        console.log("JWT saved in extension");
        sendResponse({ success: true });
      });
      return true;
    }
  }
);


