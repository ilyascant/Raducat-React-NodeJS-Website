const express = require("express");
const router = express.Router();

const { login, register, loginWithGoogle, signout } = require("../controller/auth.js");
const verifyAccessToken = require("./verifyAccessToken.js");

router.post("/signin", login);
router.post("/signup", register);
router.post("/signinwithgoogle", loginWithGoogle);
router.post("/verifyAccessToken", verifyAccessToken);
router.post("/signout", signout);

module.exports = router;
