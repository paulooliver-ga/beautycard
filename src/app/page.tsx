import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between"
        style={{ borderColor: "rgba(212,175,55,0.2)", background: "rgba(10,8,2,0.9)" }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💳</span>
          <span className="text-xl font-bold gold-text">BeautyCard</span>
        </div>
        <Link href="/login" className="btn-outline text-sm px-4 py-2">Entrar</Link>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
          style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37" }}>
          ✨ Cartão fidelidade digital para salões
        </div>

        <h1 className="text-5xl font-bold leading-tight mb-6" style={{ color: "#f5e6a3" }}>
          Fidelize suas clientes com{" "}
          <span className="gold-text">tecnologia</span>
        </h1>

        <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: "rgba(212,175,55,0.6)" }}>
          Substitua o cartão de papel por um app elegante. Sua cliente escaneia o QR Code
          e acumula pontos automaticamente. Simples assim.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cadastro"
            className="btn-gold text-lg px-8 py-4 rounded-2xl inline-block">
            Quero para meu salão →
          </Link>
          <a href="https://wa.me/5561982533037"
            target="_blank" rel="noopener noreferrer"
            className="btn-outline text-lg px-8 py-4 rounded-2xl inline-block">
            Falar no WhatsApp
          </a>
        </div>

        <p className="text-sm mt-6" style={{ color: "rgba(212,175,55,0.4)" }}>
          R$ 97/mês • Sem taxa de setup • Cancele quando quiser
        </p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: "#f5e6a3" }}>
          Tudo que seu salão precisa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "📱", title: "QR Code por serviço", desc: "Sua cliente escaneia e o ponto é registrado na hora. Sem papel, sem esquecimento." },
            { icon: "🎁", title: "Recompensas automáticas", desc: "A cada 3 produtos ganha um brinde. No 5º serviço, 50% de desconto. Automático." },
            { icon: "📊", title: "Painel completo", desc: "Veja todas as clientes, recompensas pendentes e gerencie promoções da semana." },
          ].map((f) => (
            <div key={f.title} className="card text-center">
              <span className="text-4xl">{f.icon}</span>
              <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: "#f5e6a3" }}>{f.title}</h3>
              <p className="text-sm" style={{ color: "rgba(212,175,55,0.5)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="card" style={{ border: "2px solid rgba(212,175,55,0.5)" }}>
          <p className="text-sm font-semibold mb-2" style={{ color: "rgba(212,175,55,0.6)" }}>PLANO ÚNICO</p>
          <p className="text-5xl font-bold gold-text">R$ 97</p>
          <p className="text-sm mb-6" style={{ color: "rgba(212,175,55,0.4)" }}>/mês</p>
          <ul className="space-y-3 text-left mb-8">
            {[
              "✅ Clientes ilimitadas",
              "✅ QR Codes ilimitados",
              "✅ Painel admin completo",
              "✅ Promoções da semana",
              "✅ Link exclusivo do seu salão",
              "✅ Suporte via WhatsApp",
            ].map((item) => (
              <li key={item} className="text-sm" style={{ color: "#f5e6a3" }}>{item}</li>
            ))}
          </ul>
          <Link href="/cadastro" className="btn-gold w-full block text-center py-4">
            Começar agora →
          </Link>
          <p className="text-xs mt-4" style={{ color: "rgba(212,175,55,0.3)" }}>
            Pagamento via PIX • Ativação em até 24h
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
        <p className="text-sm" style={{ color: "rgba(212,175,55,0.3)" }}>
          © 2024 BeautyCard • Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
