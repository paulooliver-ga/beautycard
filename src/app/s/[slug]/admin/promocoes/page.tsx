"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
interface Promotion { id: string; title: string; description: string; active: boolean; startsAt: string; endsAt: string; }
export default function PromocoesPage() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", startsAt: "", endsAt: "" });
  const [adding, setAdding] = useState(false);
  async function load() { const res = await fetch("/api/salon/promotions"); setPromos(await res.json()); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setAdding(true);
    try {
      const res = await fetch("/api/salon/promotions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success("Criada!"); setForm({ title:"", description:"", startsAt:"", endsAt:"" }); load();
    } catch { toast.error("Erro"); } finally { setAdding(false); }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold gold-text">Promoções</h1>
      <div className="card">
        <h2 className="font-bold gold-text mb-4">Nova Promoção</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <input className="input-field" placeholder="Título" value={form.title} onChange={(e) => setForm({...form, title:e.target.value})} required />
          <textarea className="input-field resize-none" rows={3} placeholder="Descrição" value={form.description} onChange={(e) => setForm({...form, description:e.target.value})} required />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold uppercase block mb-1" style={{color:"rgba(212,175,55,0.5)"}}>Início</label>
              <input type="datetime-local" className="input-field" value={form.startsAt} onChange={(e) => setForm({...form, startsAt:e.target.value})} required /></div>
            <div><label className="text-xs font-semibold uppercase block mb-1" style={{color:"rgba(212,175,55,0.5)"}}>Fim</label>
              <input type="datetime-local" className="input-field" value={form.endsAt} onChange={(e) => setForm({...form, endsAt:e.target.value})} required /></div>
          </div>
          <button type="submit" disabled={adding} className="btn-gold w-full">{adding?"...":"+ Adicionar"}</button>
        </form>
      </div>
      {loading ? <p className="text-center py-8" style={{color:"rgba(212,175,55,0.4)"}}>Carregando...</p> : (
        <div className="space-y-3">
          {promos.map((p) => (
            <div key={p.id} className={`card ${!p.active?"opacity-50":""}`}>
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-semibold text-sm" style={{color:"#f5e6a3"}}>{p.title}</p>
                  <p className="text-xs mt-1" style={{color:"rgba(212,175,55,0.4)"}}>{p.description}</p></div>
                <button onClick={async () => { await fetch(`/api/salon/promotions/${p.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({active:!p.active})}); load(); }}
                  className="text-xs px-3 py-1.5 rounded-full border whitespace-nowrap" style={{borderColor:"rgba(212,175,55,0.3)",color:"rgba(212,175,55,0.5)"}}>
                  {p.active?"Encerrar":"Ativar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
