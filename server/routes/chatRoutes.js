const express = require("express");

const router = express.Router();

const {
  getMessages,
  saveMessage,
} = require("../controllers/chatController");

const {
  protect,
} = require("../middleware/authMiddleware");

// GET CHAT HISTORY
router.get(
  "/:room",
  protect,
  getMessages
);

// SAVE MESSAGE
router.post(
  "/",
  protect,
  saveMessage
);

module.exports = router;