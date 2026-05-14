import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSuperAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const admin = await prisma.superAdmin.findUnique({ where: { email } });
  if (!admin) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  await createSuperAdminSession(email);
  return NextResponse.json({ ok: true });
}
