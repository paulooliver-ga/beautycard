import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SalonBottomNav from "@/components/SalonBottomNav";

export default async function SlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const user = await getSession();
  if (!user) redirect(`/s/${params.slug}/login`);
  if (user.salon.slug !== params.slug) redirect(`/s/${user.salon.slug}/cartao`);

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-50 border-b px-4 py-3"
        style={{ background: "rgba(10,8,2,0.95)", borderColor: "rgba(212,175,55,0.25)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold gold-text text-base leading-tight">{user.salon.name}</h1>
            <p className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>
              {isAdmin ? "Painel Admin" : `Olá, ${user.name.split(" ")[0]} ✨`}
            </p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>Sair</button>
          </form>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">{children}</main>
      <SalonBottomNav slug={params.slug} isAdmin={isAdmin} whatsapp={user.salon.whatsapp} />
    </div>
  );
}
