const express = require("express");
const firestore = require("./db");

const rout = express.Router();

const fetchDataFromDatabase = async (pa) => {
  const walletRef = firestore.collection("wallets").doc(pa);
  const walletDoc = await walletRef.get();
  // console.log(walletDoc.data());
  return walletDoc.data();
};

rout.get("/getWallet/:walletId", async (req, res) => {

  try {
    // Fetch data based on walletId from your database or any data source
    const walletId = req.params.walletId;
    // console.log(walletId);
    // Example: Replace this with your actual logic to fetch data
    const data = await fetchDataFromDatabase(walletId);
    // Send the data as a JSON response
    // res.json(data);
      
    res.send(data);
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = rout;
