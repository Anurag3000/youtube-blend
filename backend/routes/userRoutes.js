const express=require("express");
const upload = require("../middleware/upload.js");

const { testUser, createUser, getAllUsers, getUserById, compareUsers, uploadWatchHistory } = require("../controllers/userController.js");
const router= express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/compare/:user1Id/:user2Id", compareUsers);

router.post("/", createUser);
router.post("/test",testUser);
router.post(
  "/:id/upload-history",
  upload.single("file"),
  uploadWatchHistory
);

module.exports=router;