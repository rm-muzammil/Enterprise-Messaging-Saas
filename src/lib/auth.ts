import { verifyToken } from "./jwt";

/**
 * Extracts user from Authorization header value
 */
export function getUserFromAuthHeader(authHeader?: string) {
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    try {
        return verifyToken(token);
    } catch {
        return null;
    }
}

/**
 * Extracts user directly from Next.js Request
 */
export async function getUserFromToken(req: Request) {
    const authHeader = req.headers.get("authorization") || undefined;
    return getUserFromAuthHeader(authHeader);
}
