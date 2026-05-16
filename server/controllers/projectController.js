const Project = require("../models/Project");
const Notification = require("../models/Notification");

const createProject = async (req, res) => {
  try {
    const { name, description, members, deadline } = req.body;

    let project = await Project.create({
      name,
      description,
      members,
      deadline,
      createdBy: req.user.id,
    });

    project = await project.populate("members", "name email");

    if (members && members.length > 0) {
      for (const memberId of members) {
        await Notification.create({
          user: memberId,
          title: "New Project Assigned",
          message: `You have been added to project "${name}"`,
          type: "project",
        });
      }
    }

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {

    let projects;

    // ADMIN → SEE ALL PROJECTS
    if (req.user.role === "admin") {

      projects = await Project.find()
        .populate("members", "name email")
        .populate("createdBy", "name");

    } else {

      // MEMBER → ONLY ASSIGNED PROJECTS
      projects = await Project.find({
        members: req.user.id,
      })
        .populate("members", "name email")
        .populate("createdBy", "name");
    }

    res.status(200).json(projects);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// GET SINGLE PROJECT
const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email")
      .populate("createdBy", "name");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getSingleProject,
};