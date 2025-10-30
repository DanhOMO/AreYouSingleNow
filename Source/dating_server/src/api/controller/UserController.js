const User = require("../../model/User");
const Swipe = require("../../model/Swipe");

exports.getSuggestions = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const dislikedSwipes = await Swipe.find({
      swiperId: loggedInUserId,
      action: "dislike",
    });

    const dislikedUserIds = dislikedSwipes.map((swipe) => swipe.targetId);

    const excludedIds = [loggedInUserId, ...dislikedUserIds];

    const users = await User.find({
      _id: { $nin: excludedIds },
    });

    if (users.length === 0) {
      console.log("Không còn ai để gợi ý");
      return res.status(200).json([]);
    }

    res.status(200).json(users);
  } catch (error) {
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
