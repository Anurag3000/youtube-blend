const express=require("express");
const upload = require("../middleware/upload.js");

const { testUser, createUser, getAllUsers, getUserById, getUserByUsername, compareUsers, uploadWatchHistory, findBestMatch } = require("../controllers/userController.js");
const router= express.Router();

router.get("/", getAllUsers);
router.get("/username/:username", getUserByUsername);
router.get("/:id", getUserById);
router.get("/compare/:user1Id/:user2Id", compareUsers);
router.get("/:id/best-match", findBestMatch);

router.post("/", createUser);
router.post("/test",testUser);
router.post(
  "/:id/upload-history",
  upload.single("file"),
  uploadWatchHistory
);

module.exports=router;