# 📚 BookBorrow | Modern Library Management

<div align="center">
  <img src="https://img.shields.io/badge/Bun-🍞-black?style=for-the-badge&logo=bun">
  <img src="https://img.shields.io/badge/Next.js-14-000?style=for-the-badge&logo=next.js">
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql">
  <br>
  <img width="200" src="https://github.com/yourusername/bookborrow/assets/.../qrcode-animation.gif" alt="QR Demo">
</div>

## 🚀 Core Features
**Borrowers**  
✅ AI Book Recommendations • 📅 Pickup Scheduling • 📊 Reading Stats  
**Admins**  
📈 Heatmap Analytics • 📤 CSV Bulk Upload • ⚡ Redis Caching

## ⚙️ Tech Stack
- **Runtime**: Bun 🍞
- **Frontend**: Next.js 14 (App Router)
- **ORM**: Prisma + PostgreSQL
- **Email**: Resend + React-Email
- **State**: Zustand 🐻
- **Payments**: Stripe Integration

## 🛠️ Quick Start

```
git clone https://github.com/PrimeBeyonder/full_stack_bookBorrow_app
cd bookborrow
bun install
```

```
bunx prisma generate
bunx prisma migrate dev
```
Create `.env.local`:

```env
DATABASE_URL="postgres://..."
RESEND_API_KEY="re_..."
STRIPE_SECRET_KEY="sk_..."
REDIS_URL="redis://..."
```

## Deploy on Vercel
```bun run dev```

##📦 Deployment
```
Set env vars in your hosting (Vercel/Netlify)
Enable Edge Functions for Redis caching
Add PostgreSQL connection
```
```bun run build```
