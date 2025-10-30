const jwt = require("jsonwebtoken");
const User = require("../../model/User");

exports.authMiddleware = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Người dùng không tồn tại" });
      }

      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ message: "Token không hợp lệ, truy cập bị từ chối" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
  }
};
