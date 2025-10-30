const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.post("save", async function (doc) {
  try {
    const Match = mongoose.model("Match");
    await Match.findByIdAndUpdate(doc.matchId, {
      lastMessageId: doc._id,
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.error("Lỗi cập nhật lastMessageId:", err);
  }
});

module.exports = mongoose.model("Message", MessageSchema);
