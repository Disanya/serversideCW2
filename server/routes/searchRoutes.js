const express = require("express");
const router = express.Router();
const {
  searchByCountry,
  searchByUser,
  sortPosts,
} = require("../controllers/searchController");

//creating api endpoints related to the searching and sorting
router.get("/country/:country", searchByCountry);
router.get("/user/:username", searchByUser);
router.get("/sort/:type", sortPosts);

module.exports = router;
