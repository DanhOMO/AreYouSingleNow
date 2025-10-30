const express = require("express");
const router = express.Router();
const { getMatches, getPartnerInfo } = require("../controller/MatchController");
const {authMiddleware} = require("../middleware/AuthMiddleware");

router.get("/", authMiddleware, getMatches);
router.get('/:matchId/partner', authMiddleware, getPartnerInfo);
module.exports = router;
