const Comment = require("../models/Comment");

// GET COMMENTS
const getTaskComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      task: req.params.taskId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
};

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      text,
      task: req.params.taskId,
      user: req.user._id,
    });

    const populatedComment =
      await Comment.findById(comment._id).populate(
        "user",
        "name email"
      );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
    });
  }
};

module.exports = {
  getTaskComments,
  addComment,
};