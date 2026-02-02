import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../services/api";
import { logout } from "../utils/auth";

export default function Dashboard() {
  const [plots, setPlots] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const fileInputRef = useRef(null);

  // 🔁 Fetch dashboard analytics
  const refreshDashboard = () => {
    setLoading(true);

    apiFetch("/api/users/dashboard-plots")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard");
        return res.json();
      })
      .then((data) => {
        console.log("Dashboard API response:", data);

        let plotsArray = [];

        if (Array.isArray(data.plots)) {
          plotsArray = data.plots;
        } else if (data.plots && typeof data.plots === "object") {
          plotsArray = Object.values(data.plots);
        }

        setPlots(plotsArray);
        setMessage(data.message || "");
      })
      .catch((err) => {
        console.error(err);
        setMessage("Unable to load analytics.");
        setPlots([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  // 📤 Upload CSV
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/upload-watch-history",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setUploadMessage("Upload successful. Processing analytics…");

      // 🔁 Refresh plots after upload
      refreshDashboard();
    } catch (err) {
      console.error(err);
      setUploadMessage("Failed to upload watch history.");
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-uploading same file
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif" }}>
      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>YouTube Blend Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </header>

      <hr />

      {/* Actions */}
      <section style={{ marginTop: "20px" }}>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleUpload}
          style={{ display: "none" }}
        />

        <button
          disabled={uploading}
          onClick={() => fileInputRef.current.click()}
          style={{ marginRight: "10px" }}
        >
          {uploading ? "Uploading..." : "Upload Watch History"}
        </button>

        <button>
          Find Matches
        </button>

        {uploadMessage && (
          <p style={{ marginTop: "10px" }}>{uploadMessage}</p>
        )}
      </section>

      {/* Analytics Area */}
      <section style={{ marginTop: "30px" }}>
        {loading && <p>Loading analytics...</p>}

        {!loading && plots.length === 0 && message && (
          <p>{message}</p>
        )}

        {!loading &&
          plots.map((url, index) => (
            <iframe
              key={index}
              src={`http://localhost:5000${url}`}
              title={`plot-${index}`}
              width="100%"
              height="500"
              style={{ border: "none", marginBottom: "20px" }}
            />
          ))}
      </section>
    </div>
  );
}
