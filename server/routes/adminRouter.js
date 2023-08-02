const express = require("express");
const router = express.Router();

const { getAllPosts } = require("../controller/getUnapprovedPosts");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");

router.get("/", isLoggedIn, isAdmin, getAllPosts);

module.exports = router;
