import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "beautycard-setup-2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const hash = await bcrypt.hash("beautycard@2024", 10);
    await prisma.superAdmin.upsert({
      where: { email: "admin@beautycard.com.br" },
      update: {},
      create: { email: "admin@beautycard.com.br", passwordHash: hash },
    });

    const salon = await prisma.salon.upsert({
      where: { slug: "studio-priscila" },
      update: {},
      create: {
        name: "Studio Priscila Sodré",
        slug: "studio-priscila",
        phone: "61982533037",
        whatsapp: "5561982533037",
        plan: "ACTIVE",
      },
    });

    const adminHash = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
      where: { salonId_phone: { salonId: salon.id, phone: "61982533037" } },
      update: {},
      create: {
        salonId: salon.id,
        name: "Priscila Sodré",
        phone: "61982533037",
        passwordHash: adminHash,
        role: "ADMIN",
      },
    });

    const services = [
      { name: "Corte", type: "SERVICE", qrCode: `qr-${salon.id}-corte` },
      { name: "Escova", type: "SERVICE", qrCode: `qr-${salon.id}-escova` },
      { name: "Hidratação", type: "SERVICE", qrCode: `qr-${salon.id}-hidratacao` },
      { name: "Queratina", type: "PRODUCT", qrCode: `qr-${salon.id}-queratina` },
      { name: "Botox Capilar", type: "PRODUCT", qrCode: `qr-${salon.id}-botox` },
    ];

    for (const s of services) {
      await prisma.service.upsert({
        where: { qrCode: s.qrCode },
        update: {},
        create: { ...s, salonId: salon.id },
      });
    }

    return NextResponse.json({ ok: true, message: "Setup concluído!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}