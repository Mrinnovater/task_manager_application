let io;

const initializeSocket = (server) => {

  const socketIo = require("socket.io");

  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    console.log("User Connected");

    socket.on("joinRoom", (room) => {

      socket.join(room);

    });

    socket.on("sendMessage", (message) => {

      io.to(message.room).emit(
        "receiveMessage",
        message
      );

    });

    socket.on("disconnect", () => {

      console.log("User Disconnected");

    });

  });

};

module.exports = {
  initializeSocket,
};