const express=require("express");
const upload = require("../middleware/upload.js");
const {protect}= require("../middleware/auth.js");
const { testUser, createUser, getAllUsers, getUserById, getUserByUsername, compareUsers, uploadWatchHistory, findBestMatch } = require("../controllers/userController.js");
const router= express.Router();



router.get("/", getAllUsers);
router.get("/username/:username", getUserByUsername);
router.get("/:id", getUserById);
router.get("/compare/:user1Id/:user2Id", protect, compareUsers);
router.get("/:id/best-match", protect, findBestMatch);

router.post("/", createUser);
router.post("/test",testUser);
router.post(
  "/upload-watch-history",
  protect,
  upload.single("file"),
  uploadWatchHistory
);

module.exports=router;