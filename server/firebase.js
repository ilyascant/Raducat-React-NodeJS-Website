const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");
const { OAuth2Client } = require("google-auth-library");

const admin = require("firebase-admin");

require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

admin.initializeApp({
  credential: admin.credential.cert({
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/gm, "\n")
      : undefined,
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
  }),
  storageBucket: process.env.STORAGE_BUCKET,
});

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_OAUTH_REDIRECT_URL;

const oauth2Client = new OAuth2Client({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const adminAuth = admin.auth();
const db = getFirestore(firebaseApp);
const storage = getStorage();

module.exports = {
  firebaseApp,
  auth,
  db,
  admin,
  adminAuth,
  storage,
  oauth2Client,
};
