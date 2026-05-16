const Task = require("../models/Task");
const Notification = require("../models/Notification");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      project,
      deadline,
      priority,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      project,
      deadline,
      priority,
      assignedBy: req.user.id,
    });

    await Notification.create({
      user: assignedTo,
      title: "New Task Assigned",
      message: `You have been assigned task "${title}"`,
      type: "task",
    });

    const assignedUser = await User.findById(
      assignedTo
    );

    if (assignedUser?.email) {

      await sendEmail(
        assignedUser.email,

        "New Task Assigned - TeamFlow",

        `
      <div style="font-family: Arial; padding:20px;">
        
        <h2 style="color:#2563eb;">
          New Task Assigned
        </h2>

        <p>Hello ${assignedUser.name},</p>

        <p>
          You have been assigned a new task in TeamFlow.
        </p>

        <div style="
          background:#f3f4f6;
          padding:15px;
          border-radius:10px;
          margin-top:15px;
        ">
          <h3>${title}</h3>

          <p>
            ${description || "No description"}
          </p>

          <p>
            <strong>Priority:</strong>
            ${priority}
          </p>

          <p>
            <strong>Deadline:</strong>
            ${deadline
          ? new Date(deadline)
            .toDateString()
          : "No deadline"
        }
          </p>
        </div>

        <p style="margin-top:20px;">
          Please login to TeamFlow to manage your task.
        </p>

      </div>
    `
      );
    }

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name")
      .populate("project", "name");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {

    let tasks;

    if (req.user.role.toLowerCase() === "admin") {

      tasks = await Task.find()
        .populate("project")
        .populate("assignedTo", "name email");

    } else {

      tasks = await Task.find({
        assignedTo: req.user._id,
      })
        .populate("project")
        .populate("assignedTo", "name email");
    }

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




// GET SINGLE TASK
const getSingleTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name")
      .populate("project", "name");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.status = status;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("project", "name")
      .populate("assignedTo", "name email");

    res.status(200).json(updatedTask);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
// UPLOAD TASK FILE
const uploadTaskFile = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    task.attachments.push({
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await task.save();

    res.status(200).json({
      message: "File uploaded successfully",
      task,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.title =
      req.body.title || task.title;

    task.description =
      req.body.description || task.description;

    task.status =
      req.body.status || task.status;

    task.priority =
      req.body.priority || task.priority;

    task.deadline =
      req.body.deadline || task.deadline;

    await task.save();

    res.status(200).json(task);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// REMOVE FILE

const removeTaskFile = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    task.attachments = task.attachments.filter(
      (file) => file.fileUrl !== req.body.fileUrl
    );

    await task.save();

    res.status(200).json({
      message: "File removed successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
module.exports = {
  createTask,
  getTasks,
  getSingleTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  uploadTaskFile,
  removeTaskFile,
};
