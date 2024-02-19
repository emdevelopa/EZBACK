// expressApp.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("./firebase");
const firestore = require("./db");

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

// Export the express app
module.exports = app;
