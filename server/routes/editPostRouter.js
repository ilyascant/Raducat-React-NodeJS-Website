const express = require("express");
const multer = require("multer");

const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");
const isOwnerOrAdmin = require("../middleware/isOwnerOrAdmin");
const sendPostAndUserData = require("../middleware/sendPostAndUserData");

const { post, quiz } = require("../controller/editpost.js");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
});

router.post("/post", isLoggedIn, upload.any(), sendPostAndUserData, isOwnerOrAdmin, post);
router.post("/post/:preview", isLoggedIn, upload.any(), sendPostAndUserData, isOwnerOrAdmin, post);

router.post("/quiz", isLoggedIn, upload.any(), sendPostAndUserData, isOwnerOrAdmin, quiz);
router.post("/quiz/:preview", isLoggedIn, upload.any(), sendPostAndUserData, isOwnerOrAdmin, quiz);

module.exports = router;
