import { NextApiRequest, NextApiResponse } from "next";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

// Extend the type of the socket so TS knows about `.server`
type NextApiResponseWithSocket = NextApiResponse & {
    socket: {
        server: HttpServer & {
            io?: IOServer;
        };
    };
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    // Initialize socket.io server only once
    if (!res.socket.server.io) {
        const io = new IOServer(res.socket.server, {
            cors: { origin: "*" },
        });
        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log("Client connected:", socket.id);

            socket.on("message", (msg) => {
                io.emit("message", msg);
            });
        });

        console.log("✅ Socket.io server initialized");
    }

    res.end();
}
