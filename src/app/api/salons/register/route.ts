import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { salonName, slug, phone, whatsapp, adminName, password } = await req.json();
    if (!salonName || !slug || !phone || !adminName || !password)
      return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
    const exists = await prisma.salon.findUnique({ where: { slug } });
    if (exists) return NextResponse.json({ error: "Esse link já está em uso" }, { status: 409 });
    const salon = await prisma.salon.create({ data: { name: salonName, slug, phone, whatsapp, plan: "TRIAL" } });
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { salonId: salon.id, name: adminName, phone, passwordHash, role: "ADMIN" } });
    return NextResponse.json({ ok: true, slug });
  } catch (err) { console.error(err); return NextResponse.json({ error: "Erro interno" }, { status: 500 }); }
}
