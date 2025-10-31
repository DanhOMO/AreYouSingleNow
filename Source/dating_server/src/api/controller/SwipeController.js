const Swipe = require("../../model/Swipe");

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

    // Tạo mới bản ghi swipe
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
