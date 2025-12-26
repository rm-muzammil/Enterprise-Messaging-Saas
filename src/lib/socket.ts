import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: IOServer | null = null;

export function initSocket(server: HTTPServer) {
    if (!io) {
        io = new IOServer(server, {
            path: "/api/socket",
            cors: {
                origin: "*",
            },
        });

        io.on("connection", (socket) => {
            console.log("🟢 User connected:", socket.id);

            socket.on("join-conversation", (conversationId: string) => {
                socket.join(conversationId);
                console.log(`Joined conversation ${conversationId}`);
            });

            socket.on("send-message", (data) => {
                socket.to(data.conversationId).emit("receive-message", data);
            });

            socket.on("disconnect", () => {
                console.log("🔴 User disconnected:", socket.id);
            });
        });
    }

    return io;
}
