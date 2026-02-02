import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { logout } from "../utils/auth";

export default function Dashboard() {
  const [plots, setPlots] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  apiFetch("/api/users/dashboard-plots")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
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
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

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
        <button style={{ marginRight: "10px" }}>
          Upload Watch History
        </button>
        <button>
          Find Matches
        </button>
      </section>

      {/* Analytics Area */}
      <section style={{ marginTop: "30px" }}>
  {loading && <p>Loading analytics...</p>}

  {!loading && plots.length === 0 && message && (
    <p>{message}</p>
  )}

  {!loading && plots.map((url, index) => (
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
