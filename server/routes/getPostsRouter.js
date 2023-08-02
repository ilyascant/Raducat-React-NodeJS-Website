const express = require("express");
const router = express.Router();

const { getUnapprovedPosts, getApprovedPosts, approvePost, getThePost, deleteThePost } = require("../controller/posts");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");
const isOwnerOrAdmin = require("../middleware/isOwnerOrAdmin");
const sendPostAndUserData = require("../middleware/sendPostAndUserData");

router.get("/approved", getApprovedPosts);

router.get("/approved/:userName/:URL", getThePost);
router.get("/unapproved/:preview/:userName/:URL", getThePost);

router.post("/approve", isLoggedIn, isAdmin, approvePost);

router.post("/delete/", isLoggedIn, sendPostAndUserData, isOwnerOrAdmin, deleteThePost);
router.post("/delete/:preview/", isLoggedIn, sendPostAndUserData, isOwnerOrAdmin, deleteThePost);

module.exports = router;
