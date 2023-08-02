const express = require("express");
const multer = require("multer");

const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn.js");
const { post, quiz } = require("../controller/createpost.js");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
});

router.post("/post", isLoggedIn, upload.any(), post);
router.post("/quiz", isLoggedIn, upload.any(), quiz);

module.exports = router;
