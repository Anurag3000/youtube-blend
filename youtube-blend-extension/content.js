console.log("YouTube Blend content script loaded");

let lastVideoUrl = null;

function isVideoPage() {
  return window.location.pathname === "/watch";
}

function extractVideoData() {
  if (!isVideoPage()) return;

  const videoUrl = window.location.href;
  if (videoUrl === lastVideoUrl) return;

  const videoTitleEl = document.querySelector(
    "h1.title yt-formatted-string"
  );

  const channelNameEl = document.querySelector(
    "ytd-channel-name a"
  );

  if (!videoTitleEl || !channelNameEl) {
    // DOM not ready yet — retry shortly
    setTimeout(extractVideoData, 500);
    return;
  }

  lastVideoUrl = videoUrl;

  const watchData = {
    videoTitle: videoTitleEl.innerText,
    channelName: channelNameEl.innerText,
    videoUrl,
    watchedAt: new Date().toISOString()
  };

  console.log("YouTube Blend – Watch captured:", watchData);
  saveWatchHistory(watchData);
}


function saveWatchHistory(entry) {
  chrome.storage.local.get({ watchHistory: [] }, (result) => {
    const history = result.watchHistory;

    history.push(entry);

    chrome.storage.local.set({ watchHistory: history });
  });
}

// Observe DOM changes
const observer = new MutationObserver(() => {
  extractVideoData();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
