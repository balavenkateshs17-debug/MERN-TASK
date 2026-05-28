const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const app = require("./app");

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth && socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.userId = decoded.id || decoded._id || decoded;
    return next();
  } catch (err) {
    return next(new Error("Invalid authentication token"));
  }
});

io.on("connection", (socket) => {
  socket.join("tasks");
  console.log(`Socket ${socket.id} joined tasks room`);

  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

if (require.main === module) {
  connectDB();

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, server, io };
