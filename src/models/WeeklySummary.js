const mongoose = require("mongoose");

const weeklySummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  week: {
    type: String, // Format: YYYY-WW
    required: true,
  },
  avgMoodScore: {
    type: Number,
    required: true,
  },
  dominantTags: {
    type: [String],
    default: [],
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WeeklySummary", weeklySummarySchema);
