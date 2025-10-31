const express = require("express");
const router = express.Router();
const Message = require("../../model/Message");

const { getMessages } = require("../controller/MessageController");
const { authMiddleware } = require("../middleware/AuthMiddleware");
router.get("/:matchId/match", authMiddleware, getMessages);

router.get("/:messageId/user", async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const message = await Message.findById(messageId).populate("senderId");

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message.senderId);
  } catch (error) {
    console.error("Error fetching user from message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:messageId", async (req, res) => {
  try {
    console.log("Fetching message by ID");
    const messageId = req.params.messageId;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Error fetching user from message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
