const User = require("../models/User");
const { runAnalyticsGeneration } = require("../utils/runAnalyticsGeneration");
const { runPlotGeneration } = require("../utils/runPlotGeneration");

exports.generateDashboardPlots = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 🔑 Step 1: Generate analytics on demand
    const categoriesDict = {};
      user.categories.forEach(c => {
        categoriesDict[c.name] = c.count;
      });

      const channelsDict = {};
      user.channels.forEach(ch => {
        channelsDict[ch.name] = ch.count;
      });

    const analytics = await runAnalyticsGeneration({
      channels: channelsDict,
  categories: categoriesDict
    });

    // 🔑 Step 2: Generate plots
    await runPlotGeneration(analytics, userId);

    res.json({
      plots: {
        top_channels: `/plots/user_${userId}/top_channels.html`,
        top_categories: `/plots/user_${userId}/top_categories.html`,
        daily_trend: `/plots/user_${userId}/daily_trend.html`
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate dashboard plots" });
  }
};
