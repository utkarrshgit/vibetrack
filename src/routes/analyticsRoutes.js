const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMoodTrend,
  getTags,
  getSummary,
} = require("../controllers/analyticsController");

router.use(protect);

router.get("/mood-trend", getMoodTrend);
router.get("/tags", getTags);
router.get("/summary", getSummary);

module.exports = router;
