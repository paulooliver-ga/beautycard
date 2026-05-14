import { redirect } from "next/navigation";
import { getSuperAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SalaoActions from "./SalaoActions";

export default async function SaloesPage() {
  const email = await getSuperAdminSession();
  if (!email) redirect("/login");

  const salons = await prisma.salon.findMany({
    include: { users: { where: { role: "CLIENT" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gold-text">👑 BeautyCard Admin</h1>
            <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.4)" }}>{salons.length} salões cadastrados</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button className="btn-outline text-sm px-4 py-2">Sair</button>
          </form>
        </div>

        <div className="space-y-4">
          {salons.map((s) => (
            <div key={s.id} className="card flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-bold" style={{ color: "#f5e6a3" }}>{s.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={s.plan === "ACTIVE"
                      ? { background: "rgba(212,175,55,0.2)", color: "#D4AF37" }
                      : s.plan === "TRIAL"
                      ? { background: "rgba(255,165,0,0.15)", color: "orange" }
                      : { background: "rgba(255,50,50,0.1)", color: "#ff6b6b" }}>
                    {s.plan}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "rgba(212,175,55,0.4)" }}>
                  /s/{s.slug} • {s.users.length} clientes • 📞 {s.phone}
                </p>
                <p className="text-xs" style={{ color: "rgba(212,175,55,0.3)" }}>
                  Cadastrado em {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <SalaoActions salonId={s.id} currentPlan={s.plan} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
