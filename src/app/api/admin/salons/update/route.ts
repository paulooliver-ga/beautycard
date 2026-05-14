import { NextRequest, NextResponse } from "next/server";
import { getSuperAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const email = await getSuperAdminSession();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { salonId, plan } = await req.json();
  await prisma.salon.update({ where: { id: salonId }, data: { plan } });
  return NextResponse.json({ ok: true });
}
