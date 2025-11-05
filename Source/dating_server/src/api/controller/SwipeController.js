const Swipe = require("../../model/Swipe");
const User = require("../../model/User");

exports.likeUser = async (req, res) => {
  try {
    const swiperId = req.user._id;
    const { targetUserId } = req.body;

    const existingSwipe = await Swipe.findOne({
      swiperId,
      targetId: targetUserId,
    });
    if (existingSwipe) {
      return res.status(400).json({ message: "Bạn đã vuốt người này rồi." });
    }

    const swipe = await Swipe.create({
      swiperId,
      targetId: targetUserId,
      action: "like",
    });

    res.status(200).json({
      success: true,
      message: "Đã vuốt phải thành công.",
      data: swipe,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý like:", error);
    res.status(500).json({ success: false, message: "Lỗi khi xử lý like." });
  }
};

exports.dislikeUser = async (req, res) => {
  try {
    const swiperId = req.user._id;
    const { targetUserId } = req.body;

    const existingSwipe = await Swipe.findOne({
      swiperId,
      targetId: targetUserId,
    });
    if (existingSwipe) {
      return res.status(400).json({ message: "Bạn đã vuốt người này rồi." });
    }

    const swipe = await Swipe.create({
      swiperId,
      targetId: targetUserId,
      action: "dislike",
    });

    res.status(200).json({
      success: true,
      message: "Đã vuốt trái thành công.",
      data: swipe,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý dislike:", error);
    res.status(500).json({ success: false, message: "Lỗi khi xử lý dislike." });
  }
};

exports.getLikedYou = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const swipes = await Swipe.find({
      targetId: loggedInUserId,
      action: "like",
    }).populate("swiperId", "profile.name profile.avatar email");

    const likedUsers = swipes.map((s) => s.swiperId);

    if (likedUsers.length === 0) {
      console.log("Không có ai thích bạn");
      return res.status(200).json([]);
    }

    res.status(200).json(likedUsers);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách LikedYou:", error);
    res
      .status(500)
      .json({ success: false, message: "Không thể tải danh sách." });
  }
};
