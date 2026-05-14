"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CadastroPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    salonName: "", slug: "", phone: "", whatsapp: "",
    adminName: "", password: "", pixKey: "",
  });

  function generateSlug(name: string) {
    return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/salons/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao cadastrar");
      setDone(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center py-12">
          <span className="text-6xl">🎉</span>
          <h2 className="text-2xl font-bold gold-text mt-6 mb-3">Cadastro recebido!</h2>
          <p className="text-sm mb-6" style={{ color: "rgba(212,175,55,0.6)" }}>
            Seu salão será ativado em até 24h após a confirmação do pagamento via PIX.
          </p>
          <div className="rounded-2xl p-4 mb-6" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
            <p className="text-xs mb-1" style={{ color: "rgba(212,175,55,0.5)" }}>Chave PIX para pagamento</p>
            <p className="text-lg font-bold" style={{ color: "#D4AF37" }}>61982533037</p>
            <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.5)" }}>R$ 97,00 — 1º mês</p>
          </div>
          <p className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>
            Após o pagamento, envie o comprovante no WhatsApp (61) 98253-3037
          </p>
          <a href="https://wa.me/5561982533037?text=Olá! Acabei de me cadastrar no BeautyCard. Segue o comprovante do PIX!"
            target="_blank" rel="noopener noreferrer"
            className="btn-gold w-full block text-center mt-6 py-3">
            Enviar comprovante 💬
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <span className="text-4xl">💳</span>
        <h1 className="text-2xl font-bold gold-text mt-3">BeautyCard</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.5)" }}>Cadastre seu salão</p>
      </div>

      <div className="w-full max-w-md card">
        {/* Steps */}
        <div className="flex gap-2 mb-6">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1 h-1 rounded-full transition-all"
              style={{ background: step >= s ? "linear-gradient(135deg,#D4AF37,#f0d060)" : "rgba(212,175,55,0.15)" }} />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <h2 className="text-lg font-bold" style={{ color: "#f5e6a3" }}>Dados do Salão</h2>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Nome do Salão</label>
                <input className="input-field" placeholder="Ex: Studio Ana Lima" value={form.salonName}
                  onChange={(e) => setForm({ ...form, salonName: e.target.value, slug: generateSlug(e.target.value) })} required />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Link do seu app</label>
                <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "2px solid rgba(212,175,55,0.2)" }}>
                  <span className="text-xs" style={{ color: "rgba(212,175,55,0.4)" }}>beautycard.com.br/s/</span>
                  <input className="flex-1 bg-transparent focus:outline-none text-sm" style={{ color: "#f5e6a3" }}
                    placeholder="meu-salao" value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>WhatsApp do Salão</label>
                <input className="input-field" placeholder="5561999999999" value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/\D/g, "") })} required />
              </div>
              <button type="button" onClick={() => setStep(2)} className="btn-gold w-full">
                Próximo →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-lg font-bold" style={{ color: "#f5e6a3" }}>Dados de Acesso</h2>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Seu nome</label>
                <input className="input-field" placeholder="Nome da proprietária" value={form.adminName}
                  onChange={(e) => setForm({ ...form, adminName: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Telefone (login)</label>
                <input className="input-field" placeholder="61999999999" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} required />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Senha</label>
                <input className="input-field" type="password" placeholder="Crie uma senha" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">← Voltar</button>
                <button type="submit" disabled={loading} className="btn-gold flex-1">
                  {loading ? "Enviando..." : "Cadastrar 🎉"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
