"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SuperAdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Erro"); return; }
      router.push("/admin/saloes");
    } catch { toast.error("Erro de conexão"); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <span className="text-4xl">👑</span>
        <h1 className="text-2xl font-bold gold-text mt-3">BeautyCard Admin</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(212,175,55,0.4)" }}>Painel do Proprietário</p>
      </div>
      <div className="w-full max-w-sm card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>E-mail</label>
            <input className="input-field" type="email" placeholder="admin@beautycard.com.br"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>Senha</label>
            <input className="input-field" type="password" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? "Entrando..." : "Entrar 👑"}
          </button>
        </form>
      </div>
    </div>
  );
}
