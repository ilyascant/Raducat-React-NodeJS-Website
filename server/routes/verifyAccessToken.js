const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

const createError = require("../utils/createError");
const { adminAuth, db } = require("../firebase");
const { doc, getDoc } = require("firebase/firestore");

module.exports = verifyAccessToken = async (req, res, next) => {
  const access_token = req.cookies.access_token;
  if (!access_token) return next(createError(401, "You are not authenticated"));

  const encryptedToken = access_token;
  const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, process.env.SECRET_KEY).toString(
    CryptoJS.enc.Utf8
  );

  jwt.verify(decryptedToken, process.env.SECRET_KEY, async (err, user) => {
    try {
      if (!user?.uid) throw new Error("Couldn't find user");
      const docRef = doc(db, "users", user?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        req.user = user;
        return res.status(202).json(docSnap.data());
      } else return next(createError(505, "No such user"));
    } catch (err) {
      console.log(err);
      res.clearCookie("access_token");
      return next(createError(505, "Access Token is expired or invalid"));
    }
  });
};
