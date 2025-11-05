const Match = require("../../model/Match");
const User = require("../../model/User");
const Swipe = require("../../model/Swipe");
const jwt = require("jsonwebtoken");

exports.getMatches = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const matches = await Match.find({
      userIds: { $in: [loggedInUserId] },
    });
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getPartnerInfo = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const { matchId } = req.params;
    // console.log("Dang tim doi tac cua ban");
    const match = await Match.findById(matchId);

    if (!match) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy cuộc trò chuyện" });
    }

    if (!match.userIds.map((id) => id.toString()).includes(loggedInUserId)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const partnerId = match.userIds.find(
      (id) => id.toString() !== loggedInUserId
    );
    // console.log("ID đối phương:", partnerId);

    if (!partnerId) {
      return res.status(404).json({ message: "Không tìm thấy đối phương" });
    }

    const partner = await User.findById(partnerId).select("profile");
    // console.log("Thông tin đối phương:", partner);
    if (!partner) {
      return res
        .status(404)
        .json({ message: "Người dùng này không còn tồn tại" });
    }

    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.manualMatch = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { targetUserId } = req.body;

    const existingMatch = await Match.findOne({
      userIds: { $all: [loggedInUserId, targetUserId] },
    });

    if (existingMatch) {
      return res.status(200).json({
        success: true,
        message: "Hai bạn đã match trước đó rồi ❤️",
        match: existingMatch,
      });
    }

    const newMatch = await Match.create({
      userIds: [loggedInUserId, targetUserId],
    });

    await Swipe.deleteMany({
      $or: [
        { swiperId: loggedInUserId, targetId: targetUserId, action: "like" },
        { swiperId: targetUserId, targetId: loggedInUserId, action: "like" },
      ],
    });

    const populatedMatch = await Match.findById(newMatch._id).populate(
      "userIds",
      "profile.name profile.avatar email"
    );

    res.status(201).json({
      success: true,
      message: "Tạo match thành công 💘",
      match: populatedMatch,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
