const Message = require("../models/Message");

// GET MESSAGES
const getMessages = async (req, res) => {
  try {

    const messages = await Message.find({
      room: req.params.room,
    })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// SAVE MESSAGE
const saveMessage = async (req, res) => {
  try {

    const { text, room } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      text,
      room,
    });

    const populatedMessage =
      await Message.findById(message._id)
        .populate("sender", "name email");

    res.status(201).json(populatedMessage);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getMessages,
  saveMessage,
};