// walletRoutes.js
const express = require("express");
const firestore = require("./db");

const router = express.Router();

// Wallet creation route for a user
router.post("/users/:userId/wallet", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { walletBalance, investments } = req.body;

    if (typeof walletBalance !== "number") {
      return res.status(400).send("Invalid wallet balance");
    }

    const walletData = {
      walletBalance: walletBalance,
      investments: [],
    };

    const userRef = firestore.collection("users").doc(userId);
    const walletRef = await firestore.collection("wallets").add(walletData);

    await userRef.update({
      walletId: walletRef.id,
    });

    console.log("Wallet created with ID:", walletRef.id);

    res.status(201).send("Wallet created and linked to the user");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating wallet");
  }
});

module.exports = router;
