const express = require("express");
const firestore = require("./db");
const uuid = require("uuid");
const moment = require("moment");
const investRouter = express.Router();

function calculateIncrease(amount) {
  return amount * (8 / 100)  + amount;
}

function ROI(amountExpected, amountInvested) {
  return (amountExpected - amountInvested) / 30
}

investRouter.post("/invest", async (req, res) => {
  const currentUtcTime = moment().utc();
  const startDate = currentUtcTime.format("YYYY-MM-DD HH:mm:ss");

  try {
    const { userId, amount } = req.body;

    const walletRef = firestore.collection("wallets").doc(userId);
    const walletDoc = await walletRef.get();

    // console.log(walletDoc.data());

    let availableBalance  = walletDoc.data().walletBalance - amount
    // Check if there's already an investment in process
    const isInvestmentInProgress =
      walletDoc.data().isInvestmentInProgress || false;

    if (isInvestmentInProgress) {
      return res
        .status(400)
        .send("Another investment is currently in process. Please wait.");
    }

    const currentInvestments = walletDoc.data().investments || [];
    const endDate = currentUtcTime
      .add(5, "minutes")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    // Example usage:
    let originalAmount = parseInt(amount);
    let increasedAmount = calculateIncrease(originalAmount);
    let ROIValue = ROI(parseInt(increasedAmount), parseInt(originalAmount));

    let newInvestment = {
      id: uuid.v4(),
      amount,
      startDate,
      endDate,
      status: "pending",
      start: 0,
      end: 30,
      amountInReturn: increasedAmount,
      ROI: parseInt(ROIValue),
    };

    const updatedInvestments = currentInvestments.concat(newInvestment);

    // Set the flag to indicate that an investment is in progress
    await walletRef.update({
      walletBalance:availableBalance,
      isInvestmentInProgress: true,
      investments: updatedInvestments,
    });

    // Start increasing the "start" property every second until it reaches the "end" value
    const intervalId = setInterval(async () => {
      const updatedWalletDoc = await walletRef.get();
      const investments = updatedWalletDoc.data().investments || [];
      const currentInvestment = investments.find(
        (investment) => investment.id === newInvestment.id
      );

      if (currentInvestment.start < currentInvestment.end) {
        currentInvestment.start++;
        // Update the investment document with the incremented "start" value

        // Calculate and update ROI every second
       let additionalROI = ROI(increasedAmount, amount);
       currentInvestment.ROI = (
         parseFloat(currentInvestment.ROI) + additionalROI
       ).toFixed(2);

        await walletRef.update({
          investments: investments.map((investment) =>
            investment.id === currentInvestment.id
              ? {
                  ...investment,
                  start: currentInvestment.start,
                  ROI: currentInvestment.ROI,
                }
              : investment
          ),
        });
      } else {
        // Stop the interval when "start" reaches "end"
        clearInterval(intervalId);
        // Update the investment status to "successful" when completed
        await walletRef.update({
          isInvestmentInProgress: false,
          investments: investments.map((investment) =>
            investment.id === currentInvestment.id
              ? { ...investment, status: "successful" }
              : investment
          ),
        });
      }
    }, 10000);

    res.status(200).send("Investment added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding investment");
  }
});

module.exports = investRouter;
