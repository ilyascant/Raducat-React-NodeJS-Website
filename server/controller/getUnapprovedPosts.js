const { db } = require("../firebase.js");
const { collection, query, getDocs, getDoc, doc, startAfter, limit, orderBy } = require("firebase/firestore");
const createError = require("../utils/createError");

const getUnapprovedPosts = async (req, res, next) => {
  const { lastPostID } = req?.query;
  const postLimit = 20;
  const postsRef = collection(db, "unapproved_posts");

  let q = query(postsRef, orderBy("postedAt", "desc"), limit(20));

  if (lastPostID) {
    const docRef = doc(db, "unapproved_posts", lastPostID);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const lastVisible = docSnap.data();
    q = query(postsRef, orderBy("postedAt", "desc"), startAfter(lastVisible?.postedAt), limit(postLimit));
  }

  const promises = [];
  const posts = [];

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
          } else reject({});
        }
      })
    );
  });

  await Promise.all(promises)
    .then((e) => e.forEach((data, index) => posts.push(data)))
    .catch(() => null);

  return posts;
};

const getApprovedQuizzes = async (req, res, next) => {
  const { lastQuizID } = req?.query;
  const quizLimit = 20;
  const postsRef = collection(db, "unapproved_quizzes");

  let q = query(postsRef, orderBy("postedAt", "desc"), limit(quizLimit));

  if (lastQuizID) {
    const docRef = doc(db, "unapproved_quizzes", lastQuizID);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const lastVisible = docSnap.data();

    q = query(postsRef, orderBy("postedAt", "desc"), startAfter(lastVisible?.postedAt), limit(quizLimit));
  }

  const promises = [];
  const quizzes = [];

  querySnapshot = await getDocs(q);
  querySnapshot.forEach((snapshot, index) => {
    promises.push(
      new Promise(async (resolve, reject) => {
        let owner;
        const quizData = snapshot.data();
        if (quizData?.owner) {
          const docRef = doc(db, "users", quizData.owner);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            owner = docSnap.data();
            resolve({ postData: { ...quizData, postID: snapshot?.id }, owner });
          } else reject({});
        }
      })
    );
  });

  await Promise.all(promises)
    .then((e) =>
      e.forEach((data, index) => {
        quizzes.push(data);
      })
    )
    .catch(() => null);
  return quizzes;
};

module.exports.getAllPosts = async (req, res, next) => {
  const posts = await getUnapprovedPosts(req, res, next);
  const quizzes = await getApprovedQuizzes(req, res, next);

  if (!posts || !quizzes) return next(createError(404, "Couldn't get posts"));

  const allPosts = [...posts, ...quizzes];

  if (!allPosts) return next(createError(505, "An Error Accured While Trying to Get All Unapproved Posts"));
  allPosts.sort((a, b) => a?.quizData?.postedAt - b?.quizData?.postedAt);

  return res.status(202).json(allPosts);
};
