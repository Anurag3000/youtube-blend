const express = require("express");
require("dotenv").config();
const app=express();

const connectDB = require("./config/db");
connectDB();

const userRoutes= require("./routes/userRoutes.js")
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/", (req, res)=>{
    res.send("YouTube Blend Backend is running");
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})