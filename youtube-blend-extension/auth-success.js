// Get the token from the URL ?token=...
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
    // Save it to Chrome's secure storage
    chrome.storage.local.set({ jwt: token }, () => {
        console.log("JWT stored successfully. Closing window...");
        
        // Optional: Notify the user visually before closing
        document.body.innerHTML = "<h1>Login Successful!</h1><p>You can close this tab now.</p>";
        
        // Close the tab after a short delay to ensure the save completes
        setTimeout(() => {
            window.close();
        }, 1500);
    });
} else {
    document.body.innerHTML = "<h1>Login Failed</h1><p>No token found in URL.</p>";
    console.error("No token found in URL parameters");
}