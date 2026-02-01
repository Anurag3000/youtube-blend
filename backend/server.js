const express = require("express");
require("dotenv").config();
const app=express();
const cors = require("cors");

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

require("./config/passport");
const passport = require("passport");

app.use(passport.initialize());
app.use("/api/auth", require("./routes/authRoutes"));


const connectDB = require("./config/db");
connectDB();

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/users", dashboardRoutes);

const userRoutes= require("./routes/userRoutes.js")
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/users", userRoutes);

app.use("/plots", express.static("public/plots"));

app.get("/", (req, res)=>{
    res.send("YouTube Blend Backend is running");
});


const { runPlotGeneration } = require("./utils/runPlotGeneration");
app.get("/test/plot", async (req, res) => {
  const analytics = {
    top_channels: [
      { name: "veritasium", score: 42.7 },
      { name: "fireship", score: 21.9 }
    ],
    top_categories: [
      { name: "science", score: 61.4 }
    ],
    daily_watch_stats: [
      { date: "2026-01-01", watch_score: 3.2 }
    ]
  };

  await runPlotGeneration(analytics, "test_user");

  res.send("Plots generated");
});





app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})