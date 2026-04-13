const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

connectDB();

const app = express();

const userRoutes = require("./routes/users");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("jag lär mig backend nu ~@");
});

app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
