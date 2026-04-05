import { MAP_WIDTH, MAP_HEIGHT } from "../utils/constants.js";
import { checkProximity, getRoomId } from "./proximity.js";
import { User } from "../models/user.model.js";

const users = new Map();
const activeConnections = new Map();

export const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("user:join", async ({ username }) => {
            const user = {
                id: socket.id,
                username,
                x: Math.floor(Math.random() * (MAP_WIDTH - 200)) + 100,
                y: Math.floor(Math.random() * (MAP_HEIGHT - 200)) + 100,
            };

            users.set(socket.id, user);

            // Save to MongoDB
            try {
                await User.findOneAndUpdate(
                    { username },
                    {
                        socketId: socket.id,
                        isOnline: true,
                        lastPosition: { x: user.x, y: user.y },
                        lastSeen: null,
                    },
                    { upsert: true, new: true }
                );
            } catch (err) {
                console.log("MongoDB save error:", err);
            }

            socket.emit("user:joined", {
                user,
                users: Array.from(users.values()),
            });

            socket.broadcast.emit("user:new", user);
        });

        socket.on("user:move", ({ x, y }) => {
            const user = users.get(socket.id);
            if (!user) return;

            user.x = x;
            user.y = y;

            socket.broadcast.emit("user:moved", {
                id: socket.id,
                x,
                y,
            });

            users.forEach((otherUser, otherId) => {
                if (otherId === socket.id) return;

                const roomId = getRoomId(socket.id, otherId);
                const isClose = checkProximity(user, otherUser);
                const isConnected = activeConnections.has(roomId);

                if (isClose && !isConnected) {
                    socket.join(roomId);
                    const otherSocket = io.sockets.sockets.get(otherId);
                    if (otherSocket) otherSocket.join(roomId);

                    activeConnections.set(roomId, [socket.id, otherId]);

                    io.to(roomId).emit("chat:connected", {
                        roomId,
                        users: [
                            { id: socket.id, username: user.username },
                            { id: otherId, username: otherUser.username },
                        ],
                    });
                } else if (!isClose && isConnected) {
                    const otherSocket = io.sockets.sockets.get(otherId);
                    if (otherSocket) otherSocket.leave(roomId);
                    socket.leave(roomId);

                    activeConnections.delete(roomId);

                    io.to(socket.id).emit("chat:disconnected", { roomId });
                    io.to(otherId).emit("chat:disconnected", { roomId });
                }
            });
        });

        socket.on("chat:message", ({ roomId, message }) => {
            const user = users.get(socket.id);
            if (!user) return;

            io.to(roomId).emit("chat:message", {
                roomId,
                senderId: socket.id,
                username: user.username,
                message,
                timestamp: Date.now(),
            });
        });

        socket.on("disconnect", async () => {
            console.log("User disconnected:", socket.id);

            const user = users.get(socket.id);

            // Update MongoDB — mark offline, save last position
            if (user) {
                try {
                    await User.findOneAndUpdate(
                        { socketId: socket.id },
                        {
                            isOnline: false,
                            socketId: null,
                            lastSeen: new Date(),
                            lastPosition: { x: user.x, y: user.y },
                        }
                    );
                } catch (err) {
                    console.log("MongoDB update error:", err);
                }
            }

            // Clean up active connections
            activeConnections.forEach((pair, roomId) => {
                if (pair.includes(socket.id)) {
                    const otherId = pair.find((id) => id !== socket.id);
                    const otherSocket = io.sockets.sockets.get(otherId);
                    if (otherSocket) {
                        otherSocket.leave(roomId);
                        otherSocket.emit("chat:disconnected", { roomId });
                    }
                    activeConnections.delete(roomId);
                }
            });

            users.delete(socket.id);
            io.emit("user:left", socket.id);
        });
    });
};