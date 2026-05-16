const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
const startReminderCron = require(
  "./cron/reminderCron"
);
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const commentRoutes = require("./routes/commentRoutes");
const chatRoutes = require("./routes/chatRoutes");

const {
  initializeSocket,
} = require("./socket/socket");

const app = express();

const server = http.createServer(app);

// SOCKET INIT
initializeSocket(server);

// MIDDLEWARE
app.use(cors());

app.use(express.json());

app.use(cookieParser());

// STATIC UPLOADS
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/chat", chatRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("API Running...");
});

// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startReminderCron();