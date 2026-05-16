const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// AUTH
router.post("/register", registerUser);

router.post("/login", loginUser);

// USER
router.get("/me", protect, getMe);

router.get("/users", protect, getAllUsers);

// PROFILE UPDATE WITH IMAGE
router.put(
  "/profile",
  protect,
  upload.single("avatar"),
  updateProfile
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

module.exports = router;