const Session = require("../models/Session");
const WeeklySummary = require("../models/WeeklySummary");

const getMoodTrend = async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user._id,
      status: "closed",
    })
      .sort({ createdAt: 1 })
      .select("createdAt moodScore");
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getTags = async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user._id,
      status: "closed",
    });
    const tagCounts = {};

    sessions.forEach((session) => {
      session.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    res.json(tagCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSummary = async (req, res) => {
  try {
    const summaries = await WeeklySummary.find({ userId: req.user._id }).sort({
      generatedAt: -1,
    });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMoodTrend, getTags, getSummary };
