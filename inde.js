import express from "express";
import mongoose from "mongoose";
import Users from "./model/user.js";
import Wallet from "./model/wallet.js";
import bodyParser from "body-parser";
const ObjectId = mongoose.Types.ObjectId;

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongoose.connect(
//   "mongodb://127.0.0.1:27017/EZHEDGE?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3"
// );

try {
  await mongoose.connect(
    "mongodb+srv://olatunbossemma17:55sEL9oZ7fW1r5oN@cluster0.7cwcrjv.mongodb.net/EZHEDGE?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout for server selection during initial connection
      socketTimeoutMS: 45000, // Timeout for operations after connection is established
    }
  );
  console.log("Connected to MongoDB");

  const wallet = await Wallet.findById("65c3a0e4c3caae83a3d32806");
  console.log(wallet);
} catch (error) {
  console.error("Error connecting to DB", error);
}

// BYDWIkI3VclMxm9A

// "mongodb+srv://olatunbossemma17:55sEL9oZ7fW1r5oN@cluster0.7cwcrjv.mongodb.net/my?retryWrites=true&w=majority"
// "mongodb://127.0.0.1:27017/EZHEDGE?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3"

// async function updateInvestmentStartTime(
//   walletId,
//   investmentId,
//   currentTime,
//   increasingAmount
// ) {
//   const query = {
//     _id: walletId,
//     "investments._id": investmentId,
//     "investments.status": "pending",
//   };

//   const update = {
//     $set: {
//       "investments.$.starttime": currentTime,
//       "investments.$.amountInReturn": increasingAmount,
//     },
//   };

//   try {
//     await Wallet.findOneAndUpdate(query, update);
//   } catch (error) {
//     console.error("Error updating data:", error);
//   }
// }

// async function updateInvestmentStatus(walletId, investmentId, status) {
//   const query = {
//     _id: walletId,
//     "investments._id": investmentId,
//     "investments.status": "pending",
//   };

//   const update = {
//     $set: {
//       "investments.$.status": status,
//     },
//   };

//   try {
//     await Wallet.findOneAndUpdate(query, update);
//   } catch (error) {
//     console.error("Error updating data:", error);
//   }
// }

// function calculateIncreaseValue(
//   principal,
//   rateOfIncreasePerSecond,
//   startTime,
//   currentTime
// ) {
//   return principal + rateOfIncreasePerSecond * (currentTime - startTime);
// }

// async function processInvestment(wallet, investment) {
//   const principal = investment.amount;
//   const totalProfitPercentage = investment.amountInReturn - principal;
//   const numberOfSeconds = investment.endtime - investment.starttime;
//   const rateOfIncreasePerSecond = totalProfitPercentage / numberOfSeconds;

//   let currentTime = investment.starttime;

//   const intervalId = setInterval(async () => {
//     const increaseValue = calculateIncreaseValue(
//       principal,
//       rateOfIncreasePerSecond,
//       investment.starttime,
//       currentTime
//     );

//     console.log(
//       `After ${currentTime} seconds: ${parseFloat(increaseValue).toFixed(2)}`
//     );

//     currentTime++;
//     let amountInReturn = parseFloat(increaseValue).toFixed(2);

//     await updateInvestmentStartTime(
//       wallet._id,
//       investment._id,
//       currentTime,
//       amountInReturn
//     );

//     if (currentTime > investment.endtime) {
//       clearInterval(intervalId);
//       await updateInvestmentStatus(wallet._id, investment._id, "successful");
//     }
//   }, 1000);
// }

// async function performInvestmentLogic() {
//   try {
//     const wallets = await Wallet.find();
//     const wallet = wallets[0];

//     // console.log(wallet);

//     let hasPendingInvestments = false;

//     for (const investment of wallet.investments) {
//       if (investment.status === "pending") {
//         hasPendingInvestments = true;
//         await processInvestment(wallet, investment);
//       }
//     }

//     if (!hasPendingInvestments) {
//       console.log("No pending investments");
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// setInterval(performInvestmentLogic, 5000);

app.get("/", (req, res) => {
  res.send("Hello, Vercel! This is the main endpoint.");
});

// Handle user registration
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).send({
        message: "Email already in use. Please choose a different email.",
      });
    }

    const user = await Users.create({ username, email, password });
    console.log(user);
    res.send("User created successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Handle investment creation
app.post("/invest", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    console.log(userId, amount);

    // Find the wallet document based on the user's ID
    const wallet = await Wallet.findById(userId);
    console.log(wallet);

    if (!wallet) {
      return res.status(404).send({ message: "Wallet not found" });
    }

    // Check if the user has sufficient funds
    if (amount > wallet.walletBalance) {
      return res.status(400).send({ message: "Insufficient funds" });
    }

    // Create a new investment
    const currentTime = new Date();
    const newInvestment = {
      _id: new ObjectId(),
      status: "pending",
      amount: parseFloat(amount),
      starttime: currentTime.getSeconds(), // Use getTime() to get timestamp in milliseconds
      endtime: currentTime.getSeconds() + 30, // 30 seconds in milliseconds
      amountInReturn: parseFloat(amount) * 1.1,
      ROI: 0,
    };

    // Update wallet's walletBalance and add the new investment
    wallet.walletBalance -= parseFloat(amount);
    wallet.investments.push(newInvestment);

    // Save the updated wallet document
    await wallet.save();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/investt/:id", async (req, res) => {
  try {
    // Extract the id parameter from the request
    const id = req.params.id;

    // Find the wallet document based on the user's ID
    const wallet = await Wallet.findById(id);

    if (!wallet) {
      return res.status(404).send("Wallet not found");
    }

    console.log(wallet);
    res.status(200).json(wallet); // Send the wallet data as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// app.get("/fetchdata", )

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
