import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage({ params }: { params: { slug: string } }) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") redirect(`/s/${params.slug}/login`);

  const salonId = user.salonId;
  const [clients, services, rewards] = await Promise.all([
    prisma.user.count({ where: { salonId, role: "CLIENT" } }),
    prisma.service.count({ where: { salonId, active: true } }),
    prisma.reward.count({ where: { used: false, loyaltyCard: { user: { salonId } } } }),
  ]);

  const recent = await prisma.loyaltyEntry.findMany({
    take: 8,
    where: { service: { salonId } },
    orderBy: { registeredAt: "desc" },
    include: { service: true, loyaltyCard: { include: { user: true } } },
  });

  const stats = [
    { label: "Clientes",         value: clients,  icon: "👩" },
    { label: "Serviços ativos",  value: services, icon: "✂️" },
    { label: "Recompensas pend.",value: rewards,  icon: "🏆" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gold-text">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.5)" }}>Bem-vinda, {user.name.split(" ")[0]}! ✨</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card text-center">
            <span className="text-2xl">{s.icon}</span>
            <p className="text-3xl font-bold gold-text mt-2">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: "rgba(212,175,55,0.4)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-bold gold-text mb-4">Atividade Recente</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "rgba(212,175,55,0.4)" }}>Nenhuma atividade ainda.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: "rgba(212,175,55,0.1)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">{e.service.type === "SERVICE" ? "✂️" : "💆"}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#f5e6a3" }}>{e.loyaltyCard.user.name}</p>
                    <p className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>{e.service.name}</p>
                  </div>
                </div>
                <p className="text-xs" style={{ color: "rgba(212,175,55,0.3)" }}>
                  {new Date(e.registeredAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
