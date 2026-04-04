import "dotenv/config";
import { connectDB } from "./db/connection.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const corsURL = process.env.CORS_URL;

const io = new Server(server, {
  cors: {
    origin: corsURL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server Started at port : ${PORT}`);
    });
  } catch (err) {
    console.log("MongoDB Connection Failed, Error: ", err);
  }
};

startServer();
