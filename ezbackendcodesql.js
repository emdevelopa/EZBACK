const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Never$give$up999",
  database: "user_details",
};

const createPool = async () => {
  try {
    const pool = await mysql.createPool(dbConfig);
    // Try executing a simple query to check the connection
    const [rows, fields] = await pool.query("SELECT 1");
    console.log("Database connection successful!");
    return pool;
  } catch (err) {
    console.error("Error creating connection pool:", err);
    throw err; // Re-throw the error to stop the app from starting
  }
};

const startApp = async () => {
  try {
    const pool = await createPool();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Error starting the app:", err);
    process.exit(1);
  }
};

startApp();
