# 💳 BeautyCard — SaaS de Fidelidade para Salões

## Como rodar localmente

```bash
npm install
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev
```

## Acessos

| Perfil | URL | Login |
|--------|-----|-------|
| Super Admin (você) | /login | admin@beautycard.com.br / beautycard@2024 |
| Admin do salão demo | /s/studio-priscila/login | 61982533037 / admin123 |
| Cliente | /s/studio-priscila/login | Criar conta |

## Estrutura de rotas

- `/` — Landing page de vendas
- `/cadastro` — Formulário de cadastro do salão
- `/login` — Login do super admin
- `/admin/saloes` — Painel do super admin (ativar/suspender salões)
- `/s/[slug]/login` — Login de cada salão
- `/s/[slug]/cartao` — Cartão fidelidade da cliente
- `/s/[slug]/promocoes` — Promoções do salão
- `/s/[slug]/admin` — Dashboard do admin do salão
- `/s/[slug]/admin/clientes` — Clientes do salão
- `/s/[slug]/admin/servicos` — Serviços e QR Codes
- `/s/[slug]/admin/promocoes` — Promoções
- `/s/[slug]/admin/recompensas` — Recompensas
- `/scan/[qrCode]` — Registro via QR Code

## Fluxo de venda

1. Salão acessa `/cadastro` e preenche os dados
2. Você recebe notificação via WhatsApp
3. Salão paga R$ 97 via PIX
4. Você acessa `/admin/saloes` e clica em **Ativar**
5. Salão recebe o link: `seuapp.com/s/slug-do-salao`

## Deploy Vercel

```bash
npx vercel --prod
```

Variáveis de ambiente necessárias:
- `DATABASE_URL` — PostgreSQL (Neon)
- `JWT_SECRET` — chave secreta
