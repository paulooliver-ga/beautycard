import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateCard } from "@/lib/loyalty";

export default async function CartaoPage({ params, searchParams }: { params: { slug: string }; searchParams: { scanned?: string; error?: string } }) {
  const user = await getSession();
  if (!user) redirect(`/s/${params.slug}/login`);
  if (user.role === "ADMIN") redirect(`/s/${params.slug}/admin`);

  const card = await getOrCreateCard(user.id);
  const entries = await prisma.loyaltyEntry.findMany({ where: { loyaltyCardId: card.id }, include: { service: true }, orderBy: { registeredAt: "desc" } });
  const rewards = await prisma.reward.findMany({ where: { loyaltyCardId: card.id, used: false }, orderBy: { createdAt: "desc" } });

  const totalServices = entries.filter((e) => e.service.type === "SERVICE").length;
  const filledDots = totalServices % 5;
  const productGroups: Record<string, { name: string; count: number }> = {};
  for (const e of entries.filter((e) => e.service.type === "PRODUCT")) {
    if (!productGroups[e.serviceId]) productGroups[e.serviceId] = { name: e.service.name, count: 0 };
    productGroups[e.serviceId].count++;
  }

  return (
    <div className="space-y-5">
      {searchParams.scanned === "1" && (
        <div className="rounded-2xl p-4 text-center font-semibold"
          style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37" }}>
          ✅ Serviço registrado!
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl p-6 text-black"
        style={{ background: "linear-gradient(135deg,#D4AF37,#f5d76e,#b8860b)", boxShadow: "0 8px 40px rgba(212,175,55,0.4)" }}>
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-10 translate-x-10" style={{ background: "rgba(255,255,255,0.15)" }} />
        <p className="text-xs uppercase tracking-widest mb-1 font-bold opacity-70">Cartão Fidelidade</p>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-sm mt-1 opacity-70">📞 {user.phone}</p>
        <div className="mt-4 pt-4 border-t border-black/20 flex gap-6">
          <div><p className="text-xs opacity-60">Visitas</p><p className="font-bold text-xl">{totalServices}</p></div>
          <div><p className="text-xs opacity-60">Recompensas</p><p className="font-bold text-xl">{rewards.length}</p></div>
        </div>
      </div>

      {rewards.length > 0 && (
        <div className="card" style={{ borderColor: "rgba(212,175,55,0.4)", background: "rgba(212,175,55,0.07)" }}>
          <h3 className="text-lg font-bold gold-text mb-3">🏆 Suas Recompensas</h3>
          {rewards.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-2xl px-4 py-3 mb-2"
              style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
              <span className="text-2xl">{r.type === "GIFT" ? "🎁" : "🏷️"}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#f5e6a3" }}>{r.type === "GIFT" ? "Brinde Especial!" : "50% de Desconto!"}</p>
                <p className="text-xs" style={{ color: "rgba(212,175,55,0.5)" }}>{r.reason}</p>
              </div>
            </div>
          ))}
          <p className="text-xs mt-2" style={{ color: "rgba(212,175,55,0.4)" }}>Mostre para a atendente 💖</p>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold gold-text">✂️ Serviços</h3>
          <span className="text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37" }}>{filledDots}/5 → 50% OFF</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${i < filledDots ? "gold-dot-filled" : "gold-dot-empty"}`}>
              {i < filledDots ? (i === 4 ? "🏷️" : "✓") : i + 1}
            </div>
          ))}
        </div>
      </div>

      {Object.keys(productGroups).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold gold-text mb-4">💆 Produtos</h3>
          {Object.entries(productGroups).map(([id, group]) => {
            const filled = group.count % 3;
            return (
              <div key={id} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm" style={{ color: "#f5e6a3" }}>{group.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(212,175,55,0.12)", color: "#D4AF37" }}>{filled}/3 → Brinde</span>
                </div>
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${i < filled ? "gold-dot-filled" : "gold-dot-empty"}`}>
                      {i < filled ? (i === 2 ? "🎁" : "✓") : i + 1}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <a href={`https://wa.me/${user.salon.whatsapp}`} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-3xl px-5 py-4 transition-all hover:opacity-90"
        style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)" }}>
        <span className="text-3xl">💬</span>
        <div>
          <p className="font-semibold text-sm" style={{ color: "#25d366" }}>Fale com o salão</p>
          <p className="text-xs" style={{ color: "rgba(37,211,102,0.6)" }}>WhatsApp</p>
        </div>
      </a>
    </div>
  );
}
