const User = require("../../model/User");
const Swipe = require("../../model/Swipe");
const Match = require("../../model/Match");

exports.getSuggestions = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const relatedSwipes = await Swipe.find({
      $or: [{ swiperId: loggedInUserId }, { targetId: loggedInUserId }],
    });

    const interactedUserIds = new Set();
    relatedSwipes.forEach((swipe) => {
      if (swipe.swiperId.toString() !== loggedInUserId) {
        interactedUserIds.add(swipe.swiperId.toString());
      }
      if (swipe.targetId.toString() !== loggedInUserId) {
        interactedUserIds.add(swipe.targetId.toString());
      }
    });

    const matches = await Match.find({
      userIds: loggedInUserId,
    });

    const matchedUserIds = new Set();
    matches.forEach((match) => {
      match.userIds.forEach((id) => {
        if (id.toString() !== loggedInUserId) {
          matchedUserIds.add(id.toString());
        }
      });
    });

    const excludedIds = [
      loggedInUserId,
      ...interactedUserIds,
      ...matchedUserIds,
    ];

    const users = await User.find({
      _id: { $nin: excludedIds },
    });

    if (users.length === 0) {
      console.log("Không còn ai để gợi ý");
      return res.status(200).json([]);
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Lỗi getSuggestions:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getWhoLikeMe = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const userLikeMe = await Swipe.find({
      targetId: loggedInUserId,
      action: "like",
    });
    const userIds = userLikeMe.map((swipe) => swipe.swiperId);

    const users = await User.find({
      _id: { $in: userIds },
    });
    if (users.length === 0) {
      console.log("Chua co ai thich ban");
      return res.status(200).json([]);
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
