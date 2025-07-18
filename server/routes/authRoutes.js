const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  getPublicProfile,
} = require("../controllers/authController");

//creating api endpoints related to the auth
router.post("/signup", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.get("/profile/:username", getPublicProfile);

module.exports = router;
