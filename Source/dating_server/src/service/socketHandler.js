const { Server } = require("socket.io");
const Message = require("../model/Message");
const Match = require("../model/Match");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

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

        io.to(matchId).emit("newMessage", savedMessage);
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client ngắt kết nối:", socket.id);
    });
  });

  console.log("✅ Khởi tạo Socket.IO thành công");
}

module.exports = initializeSocket;
