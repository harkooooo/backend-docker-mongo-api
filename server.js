const cors = require("cors");

const { protect } = require("./middleware/authmiddleware");
const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");

connectDB();

const app = express();

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth"); // 👈 NY

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("jag lär mig backend nu ~@");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes); // 👈 NY

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
