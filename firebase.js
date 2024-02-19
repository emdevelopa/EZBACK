// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./ser.json");

async function initFirebase() {
  try {
    await admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

initFirebase();

module.exports = admin;
