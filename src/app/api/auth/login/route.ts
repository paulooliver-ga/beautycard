import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { phone, password, slug } = await req.json();
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    const user = await prisma.user.findFirst({
      where: { phone: cleanPhone, salon: { slug } },
      include: { salon: true },
    });
    if (!user) return NextResponse.json({ error: "Telefone não encontrado" }, { status: 401 });
    if (user.salon.plan === "INACTIVE") return NextResponse.json({ error: "Salão inativo. Contate o suporte." }, { status: 403 });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({ role: user.role, name: user.name, slug: user.salon.slug });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
