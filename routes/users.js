const User = require("../models/User");

const admin = require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authmiddleware");
const userController = require("../controllers/userController");

// GET all users (skyddad)
router.get("/", protect, admin, userController.getAllUsers);

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

router.delete("/me", protect, userController.deleteMe);

// GET user by id (skyddad)
router.get("/:id", protect, admin, userController.getUserById);

// CREATE user (öppen - så man kan registrera sig)
router.post("/", userController.createUser);

router.post("/login", userController.loginUser);

// UPDATE user (skyddad)
router.patch("/:id", protect, userController.updateUser);

// DELETE user (skyddad)
router.delete("/:id", protect, admin, userController.deleteUser);

module.exports = router;
