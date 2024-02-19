import mongoose from "mongoose";
const { Schema, model } = mongoose;

const wallet = new Schema({
  walletBalance: Number,
  investments: [],
 
});

const Wallet = model("wallet", wallet);
export default Wallet;
