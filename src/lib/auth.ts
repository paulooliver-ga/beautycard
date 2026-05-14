import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || "beautycard-secret");

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret());
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { userId, token, expiresAt } });
  cookies().set("session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", expires: expiresAt, path: "/", sameSite: "lax" });
}

export async function getSession() {
  try {
    const token = cookies().get("session")?.value;
    if (!token) return null;
    await jwtVerify(token, secret());
    const session = await prisma.session.findUnique({ where: { token }, include: { user: { include: { salon: true } } } });
    if (!session || session.expiresAt < new Date()) return null;
    return session.user;
  } catch { return null; }
}

export async function deleteSession() {
  try {
    const token = cookies().get("session")?.value;
    if (token) await prisma.session.deleteMany({ where: { token } });
  } catch {}
  cookies().delete("session");
}

export async function getSuperAdminSession() {
  try {
    const token = cookies().get("sa_session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret());
    return payload.email as string;
  } catch { return null; }
}

export async function createSuperAdminSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret());
  cookies().set("sa_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", path: "/", sameSite: "lax" });
}
