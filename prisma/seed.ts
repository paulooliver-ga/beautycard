import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding BeautyCard...");

  // SuperAdmin
  const hash = await bcrypt.hash("beautycard@2024", 10);
  await prisma.superAdmin.upsert({
    where: { email: "admin@beautycard.com.br" },
    update: {},
    create: { email: "admin@beautycard.com.br", passwordHash: hash },
  });
  console.log("✅ SuperAdmin: admin@beautycard.com.br / beautycard@2024");

  // Salão demo
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

  // Admin do salão demo
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

  // Serviços demo
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

  console.log("✅ Salão demo criado: /s/studio-priscila");
  console.log("🎉 Seed concluído!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
