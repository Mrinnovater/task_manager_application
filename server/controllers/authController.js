const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail");

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.password = undefined;

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    let users;

    if (req.user.role === "admin") {
      users = await User.find().select("-password");
    } else {
      users = await User.find({
        role: "member",
      }).select("-password");
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PROFILE
// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // UPDATE FIELDS
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // IMAGE UPLOAD
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    // SAVE TO DATABASE
    await user.save();


console.log(
  "Saved Avatar:",
  user.avatar
);

    // FETCH UPDATED USER WITHOUT PASSWORD
    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (
  req,
  res
) => {
  try {

    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // GENERATE TOKEN
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpire =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    // RESET URL
    const resetUrl =
`${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // SEND EMAIL
    await sendEmail(
      user.email,

      "Password Reset - TeamFlow",

      `
        <div style="font-family:Arial;padding:20px;">

          <h2 style="color:#2563eb;">
            Reset Your Password
          </h2>

          <p>Hello ${user.name},</p>

          <p>
            Click below button to reset your password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              margin-top:20px;
              padding:12px 24px;
              background:#2563eb;
              color:white;
              text-decoration:none;
              border-radius:8px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:20px;">
            This link expires in 15 minutes.
          </p>

        </div>
      `
    );

    res.status(200).json({
      message:
        "Password reset link sent to email",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

// RESET PASSWORD
exports.resetPassword = async (
  req,
  res
) => {
  try {

    const user = await User.findOne({
      resetPasswordToken:
        req.params.token,

      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        req.body.password,
        10
      );

    user.password = hashedPassword;

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpire =
      undefined;

    await user.save();

    res.status(200).json({
      message:
        "Password reset successful",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};