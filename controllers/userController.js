const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const { search, sort } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      };
    }

let sortOption = {};

if (sort) {
  sortOption = sort.startsWith("-")
    ? { [sort.substring(1)]: -1 }
    : { [sort]: 1 };
}

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // ✅ HÄR
    const total = await User.countDocuments(query);

const users = await User.find(query)
  .sort(sortOption)
  .skip((page - 1) * limit)
  .limit(limit)
  .select("-password");

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: users
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    console.log("NY createUser körs");

    const { name, email, password, age } = req.body;

if (!name || !email || age === undefined) {
  return res.status(400).json({
    error: "Name, email and age are required"
  });
}

    const user = await User.create({
      name,
      email,
      password,
      age
    });

    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
if (
  req.user.id !== req.params.id &&
  req.user.role !== "admin"
) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 👇 Tillåt bara vissa fält
    const allowedFields = ["name", "age", "role"];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

if (req.body.role && req.user.role !== "admin") {
  return res.status(403).json({ message: "Only admins can change roles" });
}

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = undefined;

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {

if (
  req.user.id !== req.params.id &&
  req.user.role !== "admin"
) {
  return res.status(403).json({
    message: "Not allowed"
  });
}
const user = await User.findByIdAndDelete(req.params.id);

if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
}

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const bcrypt = require("bcrypt");

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      "secret123",
      { expiresIn: "30d" }
    );

    user.password = undefined;

    res.json({
      message: "Login successful",
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
