const { db, adminAuth } = require("../firebase.js");
const {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  startAfter,
  limit,
  onSnapshot,
  orderBy,
  startAt,
  endBefore,
  endAt,
  setDoc,
  deleteDoc,
} = require("firebase/firestore");
const createError = require("../utils/createError");

module.exports.getApprovedPosts = async (req, res, next) => {
  const { lastPostID } = req?.query;
  const postLimit = 20;

  const postsRef = collection(db, "approved_posts");

  let q = query(postsRef, orderBy("postedAt", "desc"), limit(postLimit));

  if (lastPostID) {
    const docRef = doc(db, "approved_posts", lastPostID);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return next(createError(505, "No documents found"));
    const lastVisible = docSnap.data();

    q = query(postsRef, orderBy("postedAt", "desc"), startAfter(lastVisible?.postedAt), limit(postLimit));
  }

  const promises = [];
  const posts = [];
  const nextPost = [];

  querySnapshot = await getDocs(q);
  querySnapshot.forEach((snapshot, index) => {
    promises.push(
      new Promise(async (resolve, reject) => {
        let owner;
        const postData = snapshot.data();
        if (postData?.owner) {
          const docRef = doc(db, "users", postData.owner);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            owner = docSnap.data();
            resolve({ postData: { ...postData, postID: snapshot?.id }, owner });
          } else reject(next(createError(505, "No such user")));
        }
      })
    );
  });

  await Promise.all(promises)
    .then((e) =>
      e.forEach((data, index) => {
        posts.push(data);
      })
    )
    .catch(() => null);
  return res.status(202).json({ posts });
};

module.exports.approvePost = async (req, res, next) => {
  const { postID } = req?.body;
  if (postID) {
    const docRef = doc(db, "unapproved_posts", postID);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return next(createError(404, "Couldn't find the Document"));

    try {
      const approvedDocRef = doc(db, "approved_posts", postID);
      await setDoc(approvedDocRef, docSnap.data()).catch((e) => {
        throw createError(404, "An Error Accured While Updating Data");
      });
      await deleteDoc(docRef).catch((e) => {
        throw createError(404, "An Error Accured While Deleting Data");
      });
      res.status(202).json(docSnap.data());
    } catch (error) {
      return next(createError(404, `An error accured while approving ${postID} \n${error}`));
    }
  } else {
    return next(createError(404, "Document Id couldn't reach to Approve"));
  }
};

module.exports.getThePost = async (req, res, next) => {
  const { preview, userName, URL } = req?.params;
  const dbDocURL = !preview ? "approved_posts" : "unapproved_posts";

  if (userName && URL) {
    const postRef = collection(db, dbDocURL);
    const q = query(postRef, where("postURL", "==", userName + "/" + URL));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return next(createError(404, "This page doesn't exist"));
    let postData;

    await new Promise((resolve, reject) => {
      querySnapshot.forEach(async (_doc) => {
        let stop = false;
        const postData = _doc.data();
        const docRef = doc(db, "users", postData.owner);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && !stop) {
          req.postData = { postData: _doc?.data(), owner: docSnap?.data() };
          resolve({ postData: { ..._doc?.data(), postID: _doc?.id }, owner: docSnap?.data() });
          stop = true;
        }
      });
    }).then((e) => (postData = e));
    return res.status(202).json(postData);
  } else {
    return next(createError(505, "Couldn't Get the URL"));
  }
};

module.exports.deleteThePost = async (req, res, next) => {
  const postID = req?.body?.postID;
  const pathURL = req?.pathURL;

  if (!postID) return next(createError(404, "Couldn't Get Post ID"));
  if (!pathURL) return next(createError(404, "Couldn't Get Post Path"));

  const postRef = doc(db, pathURL, postID);

  deleteDoc(postRef)
    .then(() => {
      return res.status(202).json("Successfully deleted the Document");
    })
    .catch((err) => {
      console.error("Error deleting document:", error);
      return next(createError(404, `Error deleting document: ${err}`));
    });
};
