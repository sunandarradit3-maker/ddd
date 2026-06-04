import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "ditz_token";

export function setSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  cookies().set(COOKIE_NAME, `${userId}.${token}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return token;
}

export function getSessionUserId() {
  const value = cookies().get(COOKIE_NAME)?.value;
  if (!value) return null;
  const [userId] = value.split(".");
  return userId || null;
}

export function clearSession() {
  cookies().delete(COOKIE_NAME);
}
