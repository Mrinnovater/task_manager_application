const express = require("express");

const router = express.Router();

const {
  addComment,
  getTaskComments,
} = require("../controllers/commentController");

const {
  protect,
} = require("../middleware/authMiddleware");

// GET COMMENTS
router.get(
  "/:taskId",
  protect,
  getTaskComments
);

// ADD COMMENT
router.post(
  "/:taskId",
  protect,
  addComment
);

module.exports = router;