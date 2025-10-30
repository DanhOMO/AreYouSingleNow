const express = require("express");
const router = express.Router();
const Message = require("../../model/Message");

const { getMessages } = require("../controller/MessageController");
router.get("/", getMessages);

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

router.get("/:matchId", async (req, res) => {
  try {
    const matchId = req.params.matchId;
    const messages = await Message.find({ matchId: matchId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
