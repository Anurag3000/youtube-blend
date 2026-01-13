const User = require("../models/User");
const { calculateJaccardSimilarity, calculateWeightedJaccard } = require("../utils/similarity");
const { weights } = require("../config/similarityConfig");
const {execFile} = require("child_process")
const path=require("path")

/* Utility: sanitize string arrays  */
const sanitizeStringArray = (arr = []) => {
  if (!Array.isArray(arr)) return [];

  return [
    ...new Set(
      arr
        .filter(item => typeof item === "string")
        .map(item => item.trim().toLowerCase())
        .filter(item => item.length > 0)
    )
  ];
};

/* ------------------ Test route ------------------ */
const testUser = (req, res) => {
  res.json({
    message: "Data received successfully",
    data: req.body
  });
};

/* ------------------ Create User ------------------ */
const createUser = async (req, res) => {
  try {
    const { username, name, channels, categories } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    // const cleanUsername=username;
    const cleanName = name.trim();
    const cleanChannels = sanitizeStringArray(channels);
    const cleanCategories = sanitizeStringArray(categories);

    const channelData = cleanChannels.map(name => ({
      name,
      count: 1
    }));

    const categoryData = cleanCategories.map(name => ({
      name,
      count: 1
    }));


    const user = new User({
      username: username,
      name: cleanName,
      channels: channelData,
      categories: categoryData
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ Get All Users ------------------ */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ------------------ Get User by ID ------------------ */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Invalid user ID" });
  }
};

/* ------------------ Compare Users ------------------ */
const compareUsers = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;

    const user1 = await User.findById(user1Id);
    const user2 = await User.findById(user2Id);

    if (!user1 || !user2) {
      return res.status(404).json({
        message: "One or both users not found"
      });
    }

    if (
      user1.channels.length === 0 &&
      user1.categories.length === 0
    ) {
      return res.status(200).json({
        user1: user1.name,
        user2: user2.name,
        similarityPercentage: "0%",
        reason: `${user1.name} has no activity data`
      });
    }

    if (
      user2.channels.length === 0 &&
      user2.categories.length === 0
    ) {
      return res.status(200).json({
        user1: user1.name,
        user2: user2.name,
        similarityPercentage: "0%",
        reason: `${user2.name} has no activity data`
      });
    }

    const channelSimilarity = calculateWeightedJaccard(
      user1.channels,
      user2.channels
    );

    const categorySimilarity = calculateWeightedJaccard(
      user1.categories,
      user2.categories
    );

    const finalSimilarity = (
      channelSimilarity * weights.channel +
      categorySimilarity * weights.category
    ).toFixed(2);

    const commonChannels = user1.channels
  .filter(ch1 =>
    user2.channels.some(ch2 => ch2.name === ch1.name)
  )
  .map(ch => ch.name);

const commonCategories = user1.categories
  .filter(cat1 =>
    user2.categories.some(cat2 => cat2.name === cat1.name)
  )
  .map(cat => cat.name);


    res.status(200).json({
      user1: user1.name,
      user2: user2.name,
      similarityPercentage: `${finalSimilarity}%`,
      channelSimilarity: `${channelSimilarity.toFixed(2)}%`,
      categorySimilarity: `${categorySimilarity.toFixed(2)}%`,
      commonChannels,
      commonCategories
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Watch History
const uploadWatchHistory=async(req, res)=>{
  try{
    const userId=req.params.id;

    if(!req.file){
      return res.status(400).json({
        message: "CSV File is required"
      });
    }

    const pythonScriptPath= path.join(__dirname, "../../data_processing/process_watch_history.py");

    execFile(
      "E:\\Anaconda3\\python.exe",
      [pythonScriptPath, req.file.path],
      async(error, stdout, stderr)=>{
        if(error){
          console.error("EXEC ERROR:", error);
          console.error("STDERR:", stderr);
          console.error("STDOUT:", stdout);

          return res.status(500).json({
            message: error.message || "Python execution failed"
          });
        }

        const result=JSON.parse(stdout);

        const channelData = Object.entries(result.channels).map(
          ([name, count]) => ({ name, count })
        );
        const categoryData = Object.entries(result.categories).map(
          ([name, count]) => ({ name, count })
        );

        const user = await User.findByIdAndUpdate(
          userId,
          {
            channels: channelData,
            categories: categoryData
          },
          { new: true }
        );

        res.status(200).json({
          message: "Watch History processed succesfully",
          user,
          frequencies: result
        });
      }
    );
  }catch(error){
    res.status(500).json({message: error.message});
  }
}

/* ------------------ Exports ------------------ */
module.exports = {
  testUser,
  createUser,
  getAllUsers,
  getUserById,
  compareUsers,
  uploadWatchHistory
};
