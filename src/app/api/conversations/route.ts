// import { prisma } from "@/lib/prisma";
// import { getUserFromToken } from "@/lib/auth";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//     const user = await getUserFromToken(req);
//     if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { userId } = await req.json();

//     // prevent self chat
//     if (userId === user.id) {
//         return NextResponse.json({ error: "Invalid user" }, { status: 400 });
//     }

//     const [a, b] = [user.id, userId].sort();

//     let conversation = await prisma.conversation.findUnique({
//         where: {
//             userAId_userBId: {
//                 userAId: a,
//                 userBId: b,
//             },
//         },
//     });

//     if (!conversation) {
//         conversation = await prisma.conversation.create({
//             data: {
//                 userAId: a,
//                 userBId: b,
//             },
//         });
//     }

//     return NextResponse.json(conversation);
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAuthHeader } from "@/lib/auth";

export async function POST(req: Request) {
    const user = getUserFromAuthHeader(req.headers.get("authorization") || "");
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { otherUserId } = await req.json();

    if (!otherUserId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const [userAId, userBId] =
        user.id < otherUserId
            ? [user.id, otherUserId]
            : [otherUserId, user.id];

    const conversation = await prisma.conversation.upsert({
        where: {
            userAId_userBId: { userAId, userBId },
        },
        update: {},
        create: { userAId, userBId },
    });

    return NextResponse.json(conversation);
}
