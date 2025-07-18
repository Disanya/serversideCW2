const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  likePost,
  dislikePost,
  getReactions,
} = require("../controllers/likeController");

//creating api endpoints related to the reactions (like , dislike)
router.post("/:id/like", auth, likePost);
router.post("/:id/dislike", auth, dislikePost);
router.get("/:id/reactions", getReactions);

module.exports = router;
