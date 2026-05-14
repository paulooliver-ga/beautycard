import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "BeautyCard — Fidelidade para Salões",
  description: "Cartão fidelidade digital para salões de beleza",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: "12px", background: "#1a1200", color: "#f5e6a3", border: "1px solid rgba(212,175,55,0.3)" } }} />
      </body>
    </html>
  );
}
