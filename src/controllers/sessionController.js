const Session = require("../models/Session");
const { tagSession } = require("../utils/gemini");

const createSession = async (req, res) => {
  try {
    const session = await Session.create({ userId: req.user._id });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const appendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId: req.user._id,
    });

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status === "closed")
      return res.status(400).json({ message: "Session is closed" });

    session.messages.push({ text });
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const closeSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId: req.user._id,
    });

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status === "closed")
      return res.status(400).json({ message: "Session already closed" });

    const nlpData = await tagSession(session.messages);

    session.status = "closed";
    session.sentiment = nlpData.sentiment;
    session.moodScore = nlpData.moodScore;
    session.tags = nlpData.tags;

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId: req.user._id,
    });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSession,
  appendMessage,
  closeSession,
  getSessions,
  getSessionById,
};
