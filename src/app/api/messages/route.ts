// import { prisma } from "@/lib/prisma";
// import { getUserFromToken } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//     const user = await getUserFromToken(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { conversationId, content } = await req.json();

//     const message = await prisma.message.create({
//         data: {
//             content,
//             senderId: user.id,
//             conversationId,
//         },
//     });

//     return NextResponse.json(message);
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAuthHeader } from "@/lib/auth";
// import { getSocket } from "@/lib/socket-client";
import { getSocket } from "@/lib/socket-server";

export async function POST(req: Request) {
    const authHeader = req.headers.get("Authorization") || "";
    const user = await getUserFromAuthHeader(authHeader);

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { conversationId, content } = body;

    if (!conversationId || !content) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1️⃣ Save message in DB
    const message = await prisma.message.create({
        data: {
            conversationId,
            senderId: user.id,
            content,
        },
    });

    // 2️⃣ Emit message via Socket.IO
    const io = getSocket();
    io.to(conversationId).emit("receive-message", message);

    return NextResponse.json(message);
}
