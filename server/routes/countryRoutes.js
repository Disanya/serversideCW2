const express = require("express");
const router = express.Router();
const { getCountry } = require("../controllers/countryController");

//creating api endpoints related to the countryfetch
router.get("/country", getCountry);

module.exports = router;
