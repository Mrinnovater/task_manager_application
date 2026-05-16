const express = require("express");
const router = express.Router();

const multer = require("multer");

const { protect } = require("../middleware/authMiddleware");

const {
  getTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  uploadTaskFile,
  removeTaskFile,
} = require("../controllers/taskController");

// MULTER STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });


// ROUTES

router.post("/", protect, createTask);

router.get("/", protect, getTasks);

router.get("/:id", protect, getSingleTask);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, deleteTask);

router.put(
  "/:id/status",
  protect,
  updateTaskStatus
);


// FILE UPLOAD ROUTE
router.post(
  "/:id/upload",
  protect,
  upload.single("file"),
  uploadTaskFile
);

router.put(
  "/:id/remove-file",
  protect,
  removeTaskFile
);

module.exports = router;