import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuthHeader } from "@/lib/auth";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ✅ PUBLIC ROUTES (NO AUTH)
    if (
        pathname.startsWith("/api/auth/login") ||
        pathname.startsWith("/api/auth/register")
    ) {
        return NextResponse.next();
    }

    // 🔒 PROTECT API ROUTES
    if (pathname.startsWith("/api")) {
        const authHeader = req.headers.get("authorization");
        const user = getUserFromAuthHeader(authHeader || undefined);

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};
