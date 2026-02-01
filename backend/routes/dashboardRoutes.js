const express = require("express");
const router = express.Router();
const { protect }  = require("../middleware/auth");
const {generateDashboardPlots} = require("../controllers/dashboardController.js");

router.get("/dashboard-plots", protect, generateDashboardPlots);

module.exports = router;
