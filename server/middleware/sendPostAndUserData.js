const { db, adminAuth } = require("../firebase.js");
const { collection, query, where, getDocs, getDoc, doc } = require("firebase/firestore");
const createError = require("../utils/createError");

module.exports = sendPostAndUserData = async (req, res, next) => {
  const { preview } = req?.params;
  const { postType } = req?.body;
  const docID = req?.body?.postID;

  let dbDocURL;
  if (preview) {
    if (postType === "posts") dbDocURL = "unapproved_posts";
    else if (postType === "quizzes") dbDocURL = "unapproved_quizzes";
  } else {
    if (postType === "posts") dbDocURL = "approved_posts";
    else if (postType === "quizzes") dbDocURL = "approved_quizzes";
  }

  if (docID && dbDocURL) {
    const postRef = doc(db, dbDocURL, docID);
    const postSnap = await getDoc(postRef);
    if (!postSnap.exists()) {
      return next(createError(404, "Couldn't find the Post"));
    }
    const postData = postSnap.data();

    const ownerRef = doc(db, "users", postData.owner);
    const ownerSnap = await getDoc(ownerRef);
    if (!ownerSnap.exists()) {
      return next(createError(404, "Couldn't find the Owner of Post"));
    }
    const ownerData = ownerSnap.data();
    req.pathURL = dbDocURL;
    req.postData = { postData: { ...postData, postID: dbDocURL + "/" + postSnap?.id }, owner: ownerData };
    return next();
  } else {
    next(createError(505, "Couldn't Get the URL or ID"));
  }
};
