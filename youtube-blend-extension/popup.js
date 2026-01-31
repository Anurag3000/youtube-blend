function updateAuthUI() {
  chrome.storage.local.get("jwt", ({ jwt }) => {
    const status = document.getElementById("authStatus");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const uploadBtn = document.getElementById("uploadBtn");

    if (jwt) {
      status.textContent = "🟢 Logged in";
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      uploadBtn.disabled = false;
    } else {
      status.textContent = "🔴 Logged out";
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      uploadBtn.disabled = true;
    }
  });
}


// -------------------- EXPORT CSV (unchanged) --------------------
document.getElementById("exportBtn").addEventListener("click", () => {
  chrome.storage.local.get({ watchHistory: [] }, (result) => {
    const history = result.watchHistory;
    if (history.length === 0) {
      alert("No watch history found!");
      return;
    }

    const csv = convertToCSV(history);
    downloadCSV(csv);
  });
});

function convertToCSV(data) {
  const headers = ["videoTitle", "channelName", "videoUrl", "watchedAt"];

  const rows = data.map(item =>
    headers
      .map(h => `"${(item[h] || "").replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

function downloadCSV(csvContent) {
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "watch_history.csv";
  a.click();

  URL.revokeObjectURL(url);
}

// -------------------- LOGIN --------------------
document.getElementById("loginBtn").addEventListener("click", () => {
  chrome.tabs.create({
    url: "http://localhost:5000/api/auth/google"
  });
});

// -------------------- UPLOAD (JWT PROTECTED) --------------------
document.getElementById("uploadBtn").addEventListener("click", () => {
  chrome.storage.local.get({ watchHistory: [], jwt: null }, async (result) => {
    const history = result.watchHistory;
    const token = result.jwt;

    if (!token) {
      alert("Please login first");
      return;
    }

    if (history.length === 0) {
      alert("No watch history to upload!");
      return;
    }

    // Convert to CSV
    const csv = convertToCSV(history);
    const blob = new Blob([csv], { type: "text/csv" });

    const formData = new FormData();
    formData.append("file", blob, "watch_history.csv");

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/upload-watch-history",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      alert("Watch history uploaded successfully!");
      console.log("Upload response:", data);

    } catch (error) {
      console.error(error);
      alert("Upload failed. Check console.");
    }
  });
});

// LOGOUT

document.getElementById("logoutBtn").addEventListener("click", () => {
  chrome.storage.local.remove("jwt", () => {
    alert("Logged out successfully");
    console.log("JWT removed");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
});


chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.jwt) {
    updateAuthUI();
  }
});

