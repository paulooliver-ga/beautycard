import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { getOrCreateCard } from "@/lib/loyalty";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password, slug } = await req.json();
    const cleanPhone = String(phone || "").replace(/\D/g, "");
    const salon = await prisma.salon.findUnique({ where: { slug } });
    if (!salon) return NextResponse.json({ error: "Salão não encontrado" }, { status: 404 });
    const exists = await prisma.user.findFirst({ where: { salonId: salon.id, phone: cleanPhone } });
    if (exists) return NextResponse.json({ error: "Telefone já cadastrado" }, { status: 409 });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { salonId: salon.id, name, phone: cleanPhone, passwordHash, role: "CLIENT" } });
    await getOrCreateCard(user.id);
    await createSession(user.id);
    return NextResponse.json({ role: user.role, name: user.name, slug });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
