"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SalonBottomNav({ slug, isAdmin, whatsapp }: { slug: string; isAdmin: boolean; whatsapp: string }) {
  const pathname = usePathname();

  const clientTabs = [
    { href: `/s/${slug}/cartao`,    label: "Cartão",    icon: "💳" },
    { href: `/s/${slug}/promocoes`, label: "Promoções", icon: "🌟" },
  ];

  const adminTabs = [
    { href: `/s/${slug}/admin`,        label: "Dashboard",  icon: "📊" },
    { href: `/s/${slug}/admin/clientes`,   label: "Clientes",   icon: "👩" },
    { href: `/s/${slug}/admin/servicos`,   label: "Serviços",   icon: "✂️" },
    { href: `/s/${slug}/admin/promocoes`,  label: "Promoções",  icon: "🌟" },
    { href: `/s/${slug}/admin/recompensas`,label: "Recompensas",icon: "🏆" },
  ];

  const tabs = isAdmin ? adminTabs : clientTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t px-2 py-2 z-50"
      style={{ background: "rgba(10,8,2,0.97)", borderColor: "rgba(212,175,55,0.25)" }}>
      <div className="max-w-lg mx-auto flex justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all"
              style={active
                ? { background: "linear-gradient(135deg,#D4AF37,#f0d060)", color: "#000" }
                : { color: "rgba(212,175,55,0.5)" }}>
              <span className="text-lg">{tab.icon}</span>
              <span className="text-xs font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      {!isAdmin && (
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
          className="fixed bottom-20 right-4 bg-green-500 text-white w-14 h-14 rounded-full
                     flex items-center justify-center shadow-xl hover:scale-110 transition-all text-2xl z-50">
          💬
        </a>
      )}
    </nav>
  );
}
