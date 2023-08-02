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

module.exports.approveQuiz = async (req, res, next) => {
  const { postID } = req?.body;
  if (postID) {
    const docRef = doc(db, "unapproved_quizzes", postID);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return next(createError(404, "Couldn't find the Document"));

    try {
      const approvedDocRef = doc(db, "approved_quizzes", postID);
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

module.exports.getApprovedQuizzes = async (req, res, next) => {
  const { lastQuizID } = req?.query;
  const quizLimit = 20;
  const postsRef = collection(db, "approved_quizzes");

  let q = query(postsRef, orderBy("postedAt", "desc"), limit(quizLimit));

  if (lastQuizID) {
    const docRef = doc(db, "approved_quizzes", lastQuizID);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return next(createError(505, "No documents found"));
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
          } else reject(next(createError(505, "No such user")));
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
  return res.status(202).json({ quizzes });
};

module.exports.getTheQuiz = async (req, res, next) => {
  const { preview, userName, URL } = req?.params;

  const dbDocURL = !preview ? "approved_quizzes" : "unapproved_quizzes";

  if (userName && URL) {
    const quizRef = collection(db, dbDocURL);
    const q = query(quizRef, where("postURL", "==", userName + "/" + URL));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return next(createError(404, "This page doesn't exist"));
    let quizData;

    await new Promise((resolve, reject) => {
      querySnapshot.forEach(async (_doc) => {
        let stop = false;
        const quizData = _doc.data();
        const docRef = doc(db, "users", quizData.owner);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && !stop) {
          req.postData = { postData: _doc?.data(), owner: docSnap?.data() };
          resolve({ postData: { ..._doc?.data(), postID: _doc?.id }, owner: docSnap?.data() });
          stop = true;
        }
      });
    }).then((e) => (quizData = e));
    return res.status(202).json(quizData);
  } else {
    return next(createError(505, "Couldn't Get the URL"));
  }
};

module.exports.deleteTheQuiz = async (req, res, next) => {
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

module.exports.pointForWinner = async (req, res, next) => {
  const { postID, theWinner } = req?.body;

  const dbDocURL = "approved_quizzes";

  if (postID) {
    const quizRef = doc(db, dbDocURL, postID);
    const docSnap = await getDoc(quizRef);

    if (!docSnap.exists()) return next(createError(404, "This page doesn't exist"));

    let quizData = docSnap.data();
    let foundData = quizData.postContent.find((el) => el?.name === theWinner?.name);
    if (!foundData) return next(createError(404, "An Error Accured While Searching Winner"));
    foundData.winCount = foundData.winCount + 1;
    quizData.timesPlayed = quizData.timesPlayed + 1;

    try {
      await setDoc(quizRef, quizData).catch((e) => {
        console.log(`Either passed the url limit ${postURLLen[1]} or entered less than ${postURLLen[0]} character`);
        throw createError(404, "An Error Accured While Updating Data");
      });
    } catch (err) {
      return next(err);
    }
    return res.status(202).json(quizData);
  } else {
    return next(createError(505, "Couldn't Get the URL"));
  }
};
