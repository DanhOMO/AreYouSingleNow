const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const { authMiddleware } = require("../middleware/AuthMiddleware");
const {
  getSuggestions,
  getWhoLikeMe,
  updateProfile,
} = require("../controller/UserController");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length == 0) {
      console.log("Khong co");
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/suggestions", authMiddleware, getSuggestions);

router.get("/who-like-me", authMiddleware, getWhoLikeMe);

// =========================
// 📍 GET one user by ID
// =========================
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================
// 📍 CREATE a new user
// =========================
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// =========================
// 📍 DELETE a user by ID
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================
// 📍 (Optional) FIND nearby users by location
// =========================
router.get("/nearby/:longitude/:latitude", async (req, res) => {
  const { longitude, latitude } = req.params;
  try {
    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 5000,
        },
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update-profile", authMiddleware, updateProfile);

router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
