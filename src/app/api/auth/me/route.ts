import { prisma } from "@/lib/prisma";
import { getUserFromAuthHeader } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const authHeader = req.headers.get("authorization");
    const payload = getUserFromAuthHeader(authHeader || undefined);

    if (!payload || typeof payload !== "object" || !("userId" in payload)) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) {
        return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ user });
}
