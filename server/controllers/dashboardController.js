const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    let tasks = [];
    let projects = [];

    if (req.user.role === "admin") {
      tasks = await Task.find();
      projects = await Project.find();
    } else {
      tasks = await Task.find({
        assignedTo: req.user.id,
      });

      projects = await Project.find({
        members: req.user.id,
      });
    }

    const totalUsers = await User.countDocuments();

    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const pendingTasks = tasks.filter(
      (task) => task.status === "Pending"
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const overdueTasks = tasks.filter((task) => {
      return (
        task.deadline &&
        new Date(task.deadline) < new Date() &&
        task.status !== "Completed"
      );
    }).length;

    res.status(200).json({
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      totalProjects: projects.length,
      totalMembers: totalUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};