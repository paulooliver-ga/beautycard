import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ClientesPage({ params }: { params: { slug: string } }) {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") redirect(`/s/${params.slug}/login`);

  const clients = await prisma.user.findMany({
    where: { salonId: user.salonId, role: "CLIENT" },
    include: { loyaltyCards: { include: { entries: true, rewards: { where: { used: false } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold gold-text">Clientes</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.4)" }}>{clients.length} cadastradas</p>
      </div>
      {clients.length === 0 ? (
        <div className="card text-center py-12">
          <span className="text-5xl">👩</span>
          <p className="mt-4" style={{ color: "rgba(212,175,55,0.4)" }}>Nenhuma cliente ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => {
            const card = c.loyaltyCards[0];
            return (
              <div key={c.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-black"
                    style={{ background: "linear-gradient(135deg,#D4AF37,#f0d060)" }}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#f5e6a3" }}>{c.name}</p>
                    <p className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>📞 {c.phone} • {card?.entries.length ?? 0} visitas</p>
                    {(card?.rewards.length ?? 0) > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-black mt-1 inline-block"
                        style={{ background: "linear-gradient(135deg,#D4AF37,#f0d060)" }}>
                        {card.rewards.length} recompensa{card.rewards.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs" style={{ color: "rgba(212,175,55,0.3)" }}>
                  {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
