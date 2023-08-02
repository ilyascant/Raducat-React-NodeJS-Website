const express = require("express");
const router = express.Router();

const { getApprovedQuizzes, getTheQuiz, pointForWinner, approveQuiz, deleteTheQuiz } = require("../controller/quizzes");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");
const isOwnerOrAdmin = require("../middleware/isOwnerOrAdmin");
const sendPostAndUserData = require("../middleware/sendPostAndUserData");

router.get("/approved", getApprovedQuizzes);
// router.get("/unapproved", isLoggedIn, isAdmin, getUnapprovedPosts);

router.get("/approved/:userName/:URL", getTheQuiz);
router.get("/unapproved/:preview/:userName/:URL", getTheQuiz);

router.post("/givepoint", pointForWinner);

router.post("/approve", isLoggedIn, isAdmin, approveQuiz);

router.post("/delete", isLoggedIn, sendPostAndUserData, isOwnerOrAdmin, deleteTheQuiz);
router.post("/delete/:preview", isLoggedIn, sendPostAndUserData, isOwnerOrAdmin, deleteTheQuiz);

module.exports = router;
