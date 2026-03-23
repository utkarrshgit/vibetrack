const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createSession,
  appendMessage,
  closeSession,
  getSessions,
  getSessionById,
} = require("../controllers/sessionController");
const { z } = require("zod");
const validate = require("../middleware/validateMiddleware");

const messageSchema = z.object({ text: z.string().min(1) });

router.use(protect);

router.post("/", createSession);
router.post("/:sessionId/messages", validate(messageSchema), appendMessage);
router.patch("/:sessionId/close", closeSession);
router.get("/", getSessions);
router.get("/:sessionId", getSessionById);

module.exports = router;
