const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    const { name, email, age } = req.body;

if (!name || !email || age === undefined) {
  return res.status(400).json({
    error: "Name, email and age are required"
  });
}

    const user = await User.create({
      name,
      email,
      age,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        age: req.body.age
      },
      { new: true }
    );

    if (!user) {
return res.status(404).json({
  error: "User not found"
});
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
return res.status(404).json({
  error: "User not found"
});
    }

    res.send("User deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
