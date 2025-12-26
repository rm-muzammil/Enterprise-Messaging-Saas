import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthPayload } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    return {
        id: decoded.id as string,
        email: decoded.email as string,
        role: decoded.role as string,
    };
}
