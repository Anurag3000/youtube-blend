console.log("YouTube Blend content script loaded");

let lastVideoUrl = null;

function isVideoPage() {
  return window.location.pathname === "/watch";
}

// 1. NEW: Fetch the page source manually to bypass stale SPA tags
async function fetchRealCategory(url) {
  try {
    // We request the page HTML manually (like opening it in a new hidden tab)
    const response = await fetch(url);
    const text = await response.text();
    
    // We create a fake "invisible" document to parse that HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    
    // Now we grab the tag from this FRESH document, not the stale one on screen
    const categoryMeta = doc.querySelector('meta[itemprop="genre"]');
    return categoryMeta ? categoryMeta.getAttribute("content") : "General";
    
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return "General"; // Fallback if fetch fails
  }
}

// 2. Updated Main Function (Now Async!)
async function extractVideoData() {
  if (!isVideoPage()) return;

  const videoUrl = window.location.href;
  
  // Prevent duplicate processing
  if (videoUrl === lastVideoUrl) return;

  const videoTitleEl = document.querySelector("h1.title yt-formatted-string");
  const channelNameEl = document.querySelector("ytd-channel-name a");

  if (!videoTitleEl || !channelNameEl) {
    // DOM not ready yet — retry shortly
    setTimeout(extractVideoData, 500);
    return;
  }

  // Lock this URL so we don't process it again while fetching
  lastVideoUrl = videoUrl;

  // 3. AWAIT the real category
  // This fetches the fresh data from the server while the user watches
  const realCategory = await fetchRealCategory(videoUrl);

  const watchData = {
    videoTitle: videoTitleEl.innerText,
    channelName: channelNameEl.innerText,
    category: realCategory, // Uses the fetched category
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