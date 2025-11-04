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
io.on("connection", (socket) => {
  console.log("🔌 Một client đã kết nối:", socket.id);

  socket.on("joinRoom", ({ matchId }) => {
    socket.join(matchId);
    console.log(`Client ${socket.id} đã tham gia phòng ${matchId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { matchId, text, senderId } = data;

      const newMessage = new Message({
        matchId: matchId,
        senderId: senderId,
        text: text,
      });

      let savedMessage = await newMessage.save();

      await Match.findByIdAndUpdate(matchId, {
        lastMessageId: savedMessage._id,
      });

      savedMessage = await savedMessage.populate(
        "senderId",
        "profile.name profile.photos"
      );

      io.to(matchId).emit("newMessage", savedMessage);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client ngắt kết nối:", socket.id);
  });
});
