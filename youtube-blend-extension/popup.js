document.getElementById("exportBtn").addEventListener("click",()=>{
    chrome.storage.local.get({watchHistory: []}, (result)=>{
        const history=result.watchHistory;
        if(history.length===0){
            alert("No watch history found!");
            return;
        }

        const csv= convertToCSV(history);
        downloadCSV(csv);
    });
});

function convertToCSV(data){
    const headers= ["videoTitle", "channelName", "videoUrl", "watchedAt"];

    const rows= data.map(item=> headers.map(h=> `"${(item[h] || "").replace(/"/g, '""')}"`).join(","));

    return [headers.join(","), ...rows].join("\n");
}

function downloadCSV(csvContent){
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "watch_history.csv";
    a.click();

    URL.revokeObjectURL(url);
}

document.getElementById("uploadBtn").addEventListener("click", () => {
  chrome.storage.local.get({ watchHistory: [], userId: null, username: null }, async (result) => {
    const history = result.watchHistory;

    if (history.length === 0) {
      alert("No watch history to upload!");
      return;
    }

    let userId=result.userId;
    let username=result.username;

    //step 1 - ask for username if not stored
    if(!username){
      username=prompt("Enter your username: ");
      if(!username){
        alert("Username is required");
        return;
      }
    }

    //step 2: Resolve userId if not stored
    if(!userId){
      try{
        const response=await fetch(
          `http://localhost:5000/api/users/username/${username.toLowerCase()}`
        );

        if(response.status===404){
          alert("User not found. Please create user first");
          return;
        }

        const user=await response.json();
        userId=user._id;

        //store for fututre use
        chrome.storage.local.set({ userId, username });
      }
      catch(error){
        console.log(error);
        alert("Failed to resolve user");
        return;
      }
    }


    // step 3: Upload watch history

    const csv = convertToCSV(history);
    const blob = new Blob([csv], { type: "text/csv" });

    const formData = new FormData();
    formData.append("file", blob, "watch_history.csv");

    // // 🔴 IMPORTANT: replace with real user ID
    // const USER_ID = "6965001fa880cc1cd32b81dd";

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/upload-history`,
        {
          method: "POST",
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
