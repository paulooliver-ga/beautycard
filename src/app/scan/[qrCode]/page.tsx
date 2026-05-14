import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateCard, registerEntry } from "@/lib/loyalty";

export default async function ScanPage({ params }: { params: { qrCode: string } }) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect(`/s/${user.salon.slug}/admin`);

  const service = await prisma.service.findUnique({
    where: { qrCode: params.qrCode, active: true, salonId: user.salonId },
  });

  if (service) {
    const card = await getOrCreateCard(user.id);
    await registerEntry(card.id, service.id);
    redirect(`/s/${user.salon.slug}/cartao?scanned=1`);
  }

  redirect(`/s/${user.salon.slug}/cartao?error=1`);
}
