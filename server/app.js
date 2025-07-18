const express = require("express");
const cors = require("cors");
require("dotenv").config();

//All the routes of the APIs
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const countryRoutes = require("./routes/countryRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes");
const likeRoutes = require("./routes/likeRoutes");

const app = express();
app.use(cors());
app.use(express.json());

//route all the API requests created
app.use("/api/auth", authRoutes);
app.use("/api/posts", blogRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/reactions", likeRoutes);

module.exports = app;
