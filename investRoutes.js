const express = require("express");
const firestore = require("./db");
const uuid = require("uuid");
const moment = require("moment");
const investRouter = express.Router();

// const updateStartDate = (startDate, endDate) => {
//   startDate = moment(startDate); // Convert to moment object
//   const intervalId = setInterval(() => {
//     if (startDate.isSameOrAfter(endDate)) {
//       clearInterval(intervalId); // Stop the interval when startDate is after or equal to endDate
//     } else {
//       console.log(
//         "Updated startDate:",
//         startDate.format("YYYY-MM-DD HH:mm:ss")
//       );
//       startDate.add(1, "minute");
//     }
//   }, 2000); // 60000 milliseconds = 1 minute

//   return startDate.format("YYYY-MM-DD HH:mm:ss");
// };

investRouter.post("/invest", async (req, res) => {
  const currentUtcTime = moment().utc();
  const startDate = currentUtcTime.format("YYYY-MM-DD HH:mm:ss");

  try {
    const { userId, amount} = req.body;

    const walletRef = firestore.collection("wallets").doc(userId);
    const walletDoc = await walletRef.get();

    const currentInvestments = walletDoc.data().investments || [];
    const endDate = currentUtcTime
      .add(5, "minutes")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");

    const updatedStartDate = updateStartDate(startDate, endDate);

    const newInvestment = {
      id: uuid.v4(), // Generate a unique ID for the investment
      amount,
      startDate: updatedStartDate,
      endDate,
    };

    const updatedInvestments = currentInvestments.concat(newInvestment);

    await walletRef.update({
      investments: updatedInvestments,
    });

    res.status(200).send("Investment added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding investment");
  }
});

module.exports = investRouter;
