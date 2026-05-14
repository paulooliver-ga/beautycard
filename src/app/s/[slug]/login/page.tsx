"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro"); setLoading(false); return; }
      toast.success("Bem-vinda! 💖");
      if (data.role === "ADMIN") window.location.href = `/s/${slug}/admin`;
      else window.location.href = `/s/${slug}/cartao`;
    } catch {
      toast.error("Erro de conexão");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <span className="text-5xl">💳</span>
        <h1 className="text-2xl font-bold gold-text mt-3">BeautyCard</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.5)" }}>Cartão Fidelidade Digital ✨</p>
      </div>
      <div className="w-full max-w-sm card">
        <div className="flex rounded-2xl p-1 mb-5" style={{ background: "rgba(212,175,55,0.08)" }}>
          {(["login", "register"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={mode === m
                ? { background: "linear-gradient(135deg,#D4AF37,#f0d060)", color: "#000" }
                : { color: "rgba(212,175,55,0.5)" }}>
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Nome</label>
              <input className="input-field" placeholder="Seu nome" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Telefone</label>
            <input className="input-field" placeholder="61999999999" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Senha</label>
            <input className="input-field" type="password" placeholder="••••••••" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar ✨" : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}