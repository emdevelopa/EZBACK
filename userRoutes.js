const express = require("express");
const firestore = require("./db");

const router = express.Router();

// User creation route
router.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).send("Name and email are required");
    }

    // Create user document
    const userRef = await firestore.collection("users").add({
      name: name,
      email: email,
    });

    console.log("User document added with ID:", userRef.id);

    // Create wallet connection for the user with the same ID
    const walletRef = firestore.collection("wallets").doc(userRef.id);

    await walletRef.set({
      userId: userRef.id,
      walletBalance: 20000,
      investments: [], // You can set an initial balance if needed
    });

    console.log("Wallet document added with ID:", walletRef.id);

    res.status(201).send("User created");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
});

module.exports = router;
