const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/blogController");

//creating api endpoints related to the blogposts
router.post("/", auth, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

module.exports = router;
