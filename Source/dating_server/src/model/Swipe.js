// Tệp: src/api/model/Swipe.js

const mongoose = require("mongoose");

const SwipeSchema = new mongoose.Schema(
  {
    swiperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  { timestamps: true }
);

SwipeSchema.index({ swiperId: 1, action: 1 });

module.exports = mongoose.model("Swipe", SwipeSchema);
