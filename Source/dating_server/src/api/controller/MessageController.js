const Message = require("../../model/Message");
const Match = require("../../model/Match");

const jwt = require("jsonwebtoken");

exports.getMessages = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const { matchId } = req.params;

    const match = await Match.findById(matchId);
    if (!match) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy cuộc trò chuyện" });
    }

    const isParticipant = match.userIds.some(
      (id) => id.toString() === loggedInUserId
    );
    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập cuộc trò chuyện này" });
    }

    const messages = await Message.find({ matchId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Lỗi getMessages:", error);
    res.status(500).json({ message: error.message });
  }
};
