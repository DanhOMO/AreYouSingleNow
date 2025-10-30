// Tệp: src/api/routes/UploadRoute.js

const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controller/UploadController");
const { authMiddleware } = require("../middleware/AuthMiddleWare");

router.post("/", authMiddleware, uploadImage);

module.exports = router;
