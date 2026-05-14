"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SalaoActions({ salonId, currentPlan }: { salonId: string; currentPlan: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function setPlan(plan: string) {
    setLoading(true);
    try {
      await fetch("/api/admin/salons/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salonId, plan }),
      });
      toast.success(`Plano alterado para ${plan}!`);
      router.refresh();
    } catch { toast.error("Erro"); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      {currentPlan !== "ACTIVE" && (
        <button onClick={() => setPlan("ACTIVE")} disabled={loading}
          className="text-xs px-3 py-1.5 rounded-full font-semibold text-black"
          style={{ background: "linear-gradient(135deg,#D4AF37,#f0d060)" }}>
          ✅ Ativar
        </button>
      )}
      {currentPlan !== "INACTIVE" && (
        <button onClick={() => setPlan("INACTIVE")} disabled={loading}
          className="text-xs px-3 py-1.5 rounded-full font-semibold border"
          style={{ borderColor: "rgba(255,50,50,0.4)", color: "#ff6b6b" }}>
          ❌ Suspender
        </button>
      )}
    </div>
  );
}
