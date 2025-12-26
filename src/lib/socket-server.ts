import { Server as IOServer } from "socket.io";
import { Server } from "http";

let io: IOServer;

export function initSocket(server: Server) {
    if (!io) {
        io = new IOServer(server, {
            cors: { origin: "*" },
        });

        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            // Join conversation room
            socket.on("join-room", (roomId: string) => {
                socket.join(roomId);
            });

            // Handle sending messages
            socket.on("send-message", (data: { conversationId: string; message: string; senderId: string }) => {
                console.log("Message received:", data);
                // Broadcast to all in the room except sender
                socket.to(data.conversationId).emit("receive-message", data);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }

    return io;
}

export function getSocket() {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
}
