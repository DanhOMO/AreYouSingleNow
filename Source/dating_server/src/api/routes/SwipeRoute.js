const express = require("express");
const router = express.Router();
const User = require("../../model/User");
const {
  likeUser,
  dislikeUser,
  getLikedYou,
} = require("../controller/SwipeController");
const { authMiddleware } = require("../middleware/AuthMiddleware");

// Vuốt phải (LIKE)
router.post("/like", authMiddleware, likeUser);

// Vuốt trái (DISLIKE)
router.post("/dislike", authMiddleware, dislikeUser);

// Lấy danh sách người thích mình
router.get("/like-you", authMiddleware, getLikedYou);

module.exports = router;
