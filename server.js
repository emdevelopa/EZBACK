// server.js
const app = require("./app");
const userRoutes = require("./userRoutes");
const investRouter = require("./investRoutes");

// Use the user routes
app.use(userRoutes);
app.use(investRouter);
// Set up server to listen on a port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
