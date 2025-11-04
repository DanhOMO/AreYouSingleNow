//

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const userRoutes = require("./api/routes/UserRoute");
const authRoutes = require("./api/routes/AuthRoute");
const uploadRoutes = require("./api/routes/UploadRoute");
const matchRoutes = require("./api/routes/MatchRoute");
const messageRoutes = require("./api/routes/MessageRoute");
const swipeRoutes = require("./api/routes/SwipeRoute");

const cors = require("cors");
connectDB();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/swipes", swipeRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Một client đã kết nối:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client ngắt kết nối:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang lắng nghe trên cổng ${PORT}`);
  console.log(`(Có thể truy cập từ localhost hoặc từ IP mạng LAN của bạn)`);
});
