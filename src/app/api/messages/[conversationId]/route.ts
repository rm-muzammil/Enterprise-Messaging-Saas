// import { prisma } from "@/lib/prisma";
// import { getUserFromToken } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function GET(
//     req: Request,
//     { params }: { params: { conversationId: string } }
// ) {
//     const user = await getUserFromToken(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const messages = await prisma.message.findMany({
//         where: {
//             conversationId: params.conversationId,
//         },
//         orderBy: {
//             createdAt: "asc",
//         },
//     });

//     return NextResponse.json(messages);
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAuthHeader } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: { conversationId: string } }
) {
    const user = getUserFromAuthHeader(req.headers.get("authorization") || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
        where: { conversationId: params.conversationId },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
}
