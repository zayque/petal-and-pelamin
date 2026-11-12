// Edge-safe token helpers (used by middleware and server code).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "pp_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = {
  uid: number;
  name: string;
  role: "CUSTOMER" | "ADMIN";
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) {
    throw new Error("AUTH_SECRET is missing or too short — set it in .env");
  }
  return new TextEncoder().encode(value);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      uid: Number(payload.uid),
      name: String(payload.name),
      role: payload.role === "ADMIN" ? "ADMIN" : "CUSTOMER",
    };
  } catch {
    return null;
  }
}
