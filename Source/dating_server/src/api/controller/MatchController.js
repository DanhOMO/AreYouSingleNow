const Match = require("../../model/Match");
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

    if (!partnerId) {
      return res.status(404).json({ message: "Không tìm thấy đối phương" });
    }

    const partner = await User.findById(partnerId).select("profile");

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
