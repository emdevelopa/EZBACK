// server.js
const app = require("./app");
const userRoutes = require("./userRoutes");
const investRouter = require("./investRoutes");
const rout = require("./getwalletData")

// Use the user routes
app.use(userRoutes);
app.use(investRouter);
app.use(rout)
// Set up server to listen on a port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
