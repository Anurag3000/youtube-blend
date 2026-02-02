const BACKEND_URL = "http://localhost:5000";

export default function Home() {
  const handleLogin = () => {
  window.location.href =
    "http://localhost:5000/api/auth/google?source=web";
};
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>YouTube Blend</h1>

      <p style={{ maxWidth: "600px" }}>
        YouTube Blend analyzes your watch history to understand your interests
        and helps you discover people with similar viewing patterns.
      </p>

      <ul>
        <li>🔍 Analyze your YouTube watch behavior</li>
        <li>📊 Visualize insights with interactive dashboards</li>
        <li>🤝 Find users with similar interests</li>
      </ul>

      <button
        onClick={handleLogin}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Continue with Google
      </button>
    </div>
  );
}
