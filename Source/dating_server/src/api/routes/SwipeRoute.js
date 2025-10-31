const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const { likeUser, dislikeUser } = require("../controller/SwipeController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Vuốt phải (LIKE)
router.post("/like", authMiddleware, likeUser);

// Vuốt trái (DISLIKE)
router.post("/dislike", authMiddleware, dislikeUser);

module.exports = router;
