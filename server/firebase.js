const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");
const { getStorage } = require("firebase/storage");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

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
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(firebaseApp);
const adminAuth = admin.auth();
const storage = getStorage();

module.exports = {
  firebaseApp,
  auth,
  db,
  admin,
  adminAuth,
  storage,
};