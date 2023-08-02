const {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  startAfter,
  limit,
  onSnapshot,
  orderBy,
  startAt,
  setDoc,
  doc,
  getDoc,
} = require("firebase/firestore");
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} = require("firebase/auth");

const axios = require("axios");

const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const { auth, db, adminAuth, oauth2Client } = require("../firebase.js");
const createError = require("../utils/createError.js");

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  setPersistence(auth, inMemoryPersistence).then(() =>
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCrediential) => {
        const user = userCrediential.user;
        const now = Date.now();
        const userUID = user.uid;

        const iat = (s) => now / s;
        const exp = (s) => now / s + (1000 * 60 * 60 * 24 * 7) / s;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) return next(createError(505, "We Couldn't find the user. This user might be deleted. We apologize for the issue. 😭"));

        const userData = docSnap.data();
        const userOptions = {
          displayName: userData?.displayName,
          email: userData?.email,
          role: userData?.role,
          emailVerified: userData?.emailVerified,
          createdAt: userData?.createdAt,
          lastLogin: now,
          photoURL: userData?.photoURL,
          uid: userUID,
        };

        const token = jwt.sign(
          {
            ...userOptions,
            iat: iat(1000),
            exp: exp(1000),
          },
          process.env.SECRET_KEY
        );
        const encryptedToken = CryptoJS.AES.encrypt(token, process.env.SECRET_KEY).toString();

        try {
          res.cookie("access_token", encryptedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development" ? false : true,
            maxAge: exp(1),
          });

          const docRef = doc(db, "users", userUID);
          await setDoc(docRef, userOptions);

          return res.status(202).json(userOptions);
        } catch (error) {
          console.log(error);
          return next(400, error);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/wrong-password") return next(createError(505, "You entered wrong password."));
        else if (error.code === "auth/invalid-email") return next(createError(505, "You entered an invalid email."));
        else if (error.code === "auth/user-not-found") return next(createError(505, "User is not found."));
        else if (error.code === "auth/user-disabled") return next(createError(505, "User is disabled."));
        else return next(createError(505, "An error occured. Please try again. 😭"));
      })
  );
};

module.exports.register = async (req, res, next) => {
  const { email, password } = req.body;
  setPersistence(auth, inMemoryPersistence)
    .then(() =>
      createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = userCredential.user;
        const role = "user";
        const now = Date.now();
        const userUID = user.uid;

        const iat = (s) => now / s;
        const exp = (s) => now / s + (1000 * 60 * 60 * 24 * 7) / s;
        const userOptions = {
          displayName: (user?.email).split("@")[0],
          email: user?.email,
          role,
          emailVerified: user?.emailVerified,
          createdAt: now,
          lastLogin: now,
          photoURL: user?.photoURL,
          uid: userUID,
        };

        let token = jwt.sign(
          {
            ...userOptions,
            iat: iat(1000),
            exp: exp(1000),
          },
          process.env.SECRET_KEY
        );
        const encryptedToken = CryptoJS.AES.encrypt(token, process.env.SECRET_KEY).toString();

        try {
          res.cookie("access_token", encryptedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development" ? false : true,
            maxAge: exp(1),
          });

          const docRef = doc(db, "users", userUID);
          await setDoc(docRef, userOptions);

          return res.status(202).json(userOptions);
        } catch (error) {
          console.log(error);
          return next(400, error);
        }
      })
    )
    .catch((error) => {
      console.log(error);
      if (error.code === "auth/email-already-in-use") return next(createError(505, "Email is already in use."));
      else if (error.code === "auth/invalid-email") return next(createError(505, "Please enter a valid mail."));
      else if (error.code === "operation-not-allowed") return next(createError(505, "Operation is not allowed."));
      else if (error.code === "weak-password") return next(createError(505, "Please choose stronger password."));
      else return next(createError(505, "An error occured. Please try again. 😭"));
    });
};

module.exports.loginWithGoogle = async (req, res, next) => {
  const { token } = req.body;
  let user;
  const now = Date.now();
  const iat = (s) => now / s;
  const exp = (s) => now / s + (1000 * 60 * 60 * 24 * 7) / s;

  user = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  if (!user) return next(createError(505, "User is not found."));

  const docRef = doc(db, "users", user.id);
  const usersRef = collection(db, "users");

  const q = query(usersRef, where("uid", "==", user?.id));
  const querySnapshot = await getDocs(q);

  let userOptions = {
    displayName: user?.name,
    email: user?.email,
    role: "user",
    emailVerified: false,
    createdAt: now,
    lastLogin: now,
    photoURL: user?.picture,
    uid: user?.id,
  };

  if (querySnapshot.empty) {
    try {
      await setDoc(docRef, userOptions);

      const acces_token = jwt.sign(
        {
          ...userOptions,
          iat: iat(1000),
          exp: exp(1000),
        },
        process.env.SECRET_KEY
      );
      const encryptedToken = CryptoJS.AES.encrypt(acces_token, process.env.SECRET_KEY).toString();
      res.cookie("access_token", encryptedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        maxAge: exp(1),
      });

      return res.status(202).json(userOptions);
    } catch (error) {
      return next(400, error);
    }
  }

  let foundUser;
  await new Promise((resolve, reject) => {
    querySnapshot.forEach((doc) => {
      resolve(doc.data());
    });
  }).then((e) => (foundUser = e));

  userOptions = {
    displayName: foundUser?.displayName,
    email: foundUser?.email,
    role: foundUser?.role,
    emailVerified: foundUser?.emailVerified,
    createdAt: foundUser?.createdAt,
    lastLogin: now,
    photoURL: foundUser?.photoURL,
    uid: foundUser?.uid,
  };

  try {
    await setDoc(docRef, userOptions);
    const acces_token = jwt.sign(
      {
        ...userOptions,
        iat: iat(1000),
        exp: exp(1000),
      },
      process.env.SECRET_KEY
    );
    const encryptedToken = CryptoJS.AES.encrypt(acces_token, process.env.SECRET_KEY).toString();
    res.cookie("access_token", encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: exp(1),
    });
  } catch (error) {
    return next(400, error);
  }

  return res.status(202).json(userOptions);
};

module.exports.signout = async (req, res, next) => {
  try {
    if (auth.currentUser) await auth.signOut(auth);
    req.user = undefined;
    res.clearCookie("access_token");
    return res.status(202).json("user loged out");
  } catch (error) {
    req.user = undefined;
    res.clearCookie("access_token");
    return next(createError(505, "An error occured while logging out."));
  }
};
