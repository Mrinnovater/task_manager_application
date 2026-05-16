const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

const {
  createProject,
  getProjects,
  getSingleProject,
} = require("../controllers/projectController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly,adminMiddleware, createProject);
router.get("/:id", protect, getSingleProject);

router.get("/", protect, getProjects);
module.exports = router;