"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";

interface Service { id: string; name: string; type: string; qrCode: string; active: boolean; }

export default function ServicosPage({ params }: { params: { slug: string } }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", type: "SERVICE" });
  const [adding, setAdding] = useState(false);
  const [showQR, setShowQR] = useState<string | null>(null);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  async function load() {
    const res = await fetch("/api/salon/services");
    setServices(await res.json());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/salon/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success("Criado!");
      setForm({ name: "", type: "SERVICE" });
      load();
    } catch { toast.error("Erro"); }
    finally { setAdding(false); }
  }

  const svc = services.find((s) => s.id === showQR);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold gold-text">Serviços & Produtos</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.4)" }}>Gerencie e gere QR Codes</p>
      </div>

      <div className="card">
        <h2 className="font-bold gold-text mb-4">Novo Item</h2>
        <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">
          <input className="input-field flex-1 min-w-40" placeholder="Nome" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select className="input-field w-auto" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="SERVICE">Serviço ✂️</option>
            <option value="PRODUCT">Produto 💆</option>
          </select>
          <button type="submit" disabled={adding} className="btn-gold">{adding ? "..." : "+ Adicionar"}</button>
        </form>
      </div>

      {loading ? <p className="text-center py-8" style={{ color: "rgba(212,175,55,0.4)" }}>Carregando...</p> : (
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className={`card flex items-center justify-between gap-4 ${!s.active ? "opacity-40" : ""}`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{s.type === "SERVICE" ? "✂️" : "💆"}</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "#f5e6a3" }}>{s.name}</p>
                  <p className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>{s.active ? "Ativo" : "Inativo"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowQR(showQR === s.id ? null : s.id)}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold text-black"
                  style={{ background: "linear-gradient(135deg,#D4AF37,#f0d060)" }}>QR</button>
                <button onClick={async () => {
                  await fetch(`/api/salon/services/${s.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !s.active }) });
                  load();
                }} className="text-xs px-3 py-1.5 rounded-full border"
                  style={{ borderColor: "rgba(212,175,55,0.3)", color: "rgba(212,175,55,0.6)" }}>
                  {s.active ? "Desativar" : "Ativar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showQR && svc && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowQR(null)}>
          <div className="card max-w-xs w-full text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold gold-text mb-1">{svc.name}</h3>
            <div className="flex justify-center mb-4 p-4 bg-white rounded-2xl">
              <QRCodeSVG value={`${baseUrl}/scan/${svc.qrCode}`} size={180} fgColor="#1a1200" level="H" />
            </div>
            <p className="text-xs break-all font-mono p-2 mb-4 rounded-xl" style={{ color: "rgba(212,175,55,0.5)", background: "rgba(212,175,55,0.05)" }}>
              {baseUrl}/scan/{svc.qrCode}
            </p>
            <button onClick={() => { navigator.clipboard.writeText(`${baseUrl}/scan/${svc.qrCode}`); toast.success("Copiado!"); }}
              className="btn-outline w-full text-sm mb-2">Copiar link</button>
            <button onClick={() => setShowQR(null)} className="text-sm w-full py-2" style={{ color: "rgba(212,175,55,0.4)" }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
