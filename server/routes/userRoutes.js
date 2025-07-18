const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  followUser,
  unFollowUser,
  getFollowers,
  getFollowing,
  getUserFeed,
  getUserProfileSummary,
  getPublicUserProfile,
  getUserIdByUsername,
} = require("../controllers/userController");

//creating api endpoints related to the user profiles (follow , unfollow ...)
router.post("/:id/follow", auth, followUser);
router.post("/:id/unfollow", auth, unFollowUser);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);
router.get("/feed/me", auth, getUserFeed);
router.get("/profile/me", auth, getUserProfileSummary);
router.get("/profile/:id", getPublicUserProfile);
router.get("/username/:username", getUserIdByUsername);

module.exports = router;
