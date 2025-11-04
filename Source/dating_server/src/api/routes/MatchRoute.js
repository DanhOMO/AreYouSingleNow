const express = require("express");
const router = express.Router();
const {
  getMatches,
  getPartnerInfo,
  manualMatch,
  rejectMatch,
} = require("../controller/MatchController");
const { authMiddleware } = require("../middleware/AuthMiddleware");

router.get("/", authMiddleware, getMatches);
router.get("/:matchId/partner", authMiddleware, getPartnerInfo);
router.post("/create-match", authMiddleware, manualMatch);
router.delete("/reject-match", authMiddleware, rejectMatch);
module.exports = router;
