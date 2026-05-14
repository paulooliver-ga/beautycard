import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const services = await prisma.service.findMany({ where: { salonId: user.salonId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, type } = await req.json();
  const qrCode = `qr-${user.salonId.slice(-6)}-${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
  const service = await prisma.service.create({ data: { name, type, qrCode, salonId: user.salonId } });
  return NextResponse.json(service);
}
