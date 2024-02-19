const admin = require("firebase-admin");
const express = require("express");
const serviceAccount = require("./ser.json");
const bodyParser = require("body-parser");
const cors = require("cors");



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

const firestore = admin.firestore();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware
app.use(express.json());
app.use(cors());

// Test route for root path
app.get("/", (req, res) => {
  res.send("Hello, your server is up and running!");
});

// User creation route
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body; // Assuming your request body has name and email fields

    if (!name || !email) {
      return res.status(400).send("Name and email are required");
    }

    const userRef = await firestore.collection("users").add({
      name: name,
      email: email,
    });

    console.log("User document added with ID:", userRef.id);

    res.status(201).send("User created");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
});

// Set up server to listen on a port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
