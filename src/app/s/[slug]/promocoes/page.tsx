import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
export default async function PromocoesClientePage({ params }: { params: { slug: string } }) {
  const user = await getSession();
  if (!user) redirect(`/s/${params.slug}/login`);
  const now = new Date();
  const promotions = await prisma.promotion.findMany({
    where: { salonId: user.salonId, active: true, startsAt: { lte: now }, endsAt: { gte: now } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold gold-text">Promoções 🌟</h2>
      {promotions.length === 0 ? (
        <div className="card text-center py-12"><span className="text-5xl">🌸</span><p className="mt-4" style={{color:"rgba(212,175,55,0.4)"}}>Nenhuma promoção no momento.</p></div>
      ) : (
        <div className="space-y-4">
          {promotions.map((p) => (
            <div key={p.id} className="card border-l-4" style={{borderLeftColor:"#D4AF37"}}>
              <h3 className="font-semibold" style={{color:"#f5e6a3"}}>{p.title}</h3>
              <p className="text-sm mt-2" style={{color:"rgba(212,175,55,0.5)"}}>{p.description}</p>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs" style={{color:"rgba(212,175,55,0.3)"}}>Até {new Date(p.endsAt).toLocaleDateString("pt-BR",{day:"2-digit",month:"long"})}</p>
                <a href={`https://wa.me/${user.salon.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{background:"rgba(37,211,102,0.12)",color:"#25d366"}}>Agendar 💬</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
