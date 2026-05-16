const cron = require("node-cron");

const Task = require("../models/Task");
const User = require("../models/User");

const sendEmail = require("../utils/sendEmail");

const startReminderCron = () => {

  cron.schedule("0 9 * * *", async () => {

    console.log(
      "Running Deadline Reminder Cron..."
    );

    try {

      const tomorrow = new Date();

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      const start = new Date(
        tomorrow.setHours(0, 0, 0, 0)
      );

      const end = new Date(
        tomorrow.setHours(23, 59, 59, 999)
      );

      const tasks = await Task.find({
        deadline: {
          $gte: start,
          $lte: end,
        },

        status: {
          $ne: "Completed",
        },
      });

      for (const task of tasks) {

        const user = await User.findById(
          task.assignedTo
        );

        if (!user?.email) continue;

        await sendEmail(
          user.email,

          "Task Deadline Reminder - TeamFlow",

          `
            <div style="font-family: Arial; padding:20px;">
              
              <h2 style="color:#dc2626;">
                Deadline Reminder
              </h2>

              <p>Hello ${user.name},</p>

              <p>
                Your task deadline is tomorrow.
              </p>

              <div style="
                background:#f3f4f6;
                padding:15px;
                border-radius:10px;
                margin-top:15px;
              ">

                <h3>${task.title}</h3>

                <p>
                  ${
                    task.description ||
                    "No description"
                  }
                </p>

                <p>
                  <strong>Deadline:</strong>
                  ${new Date(
                    task.deadline
                  ).toDateString()}
                </p>

                <p>
                  <strong>Status:</strong>
                  ${task.status}
                </p>

              </div>

            </div>
          `
        );
      }

      console.log(
        "Reminder Emails Sent Successfully"
      );

    } catch (error) {

      console.log(
        "CRON ERROR:",
        error.message
      );
    }
  });
};

module.exports = startReminderCron;