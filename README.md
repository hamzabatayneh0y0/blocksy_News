# Blocksy News

A full-stack news and blogging platform built with **Next.js** and **TypeScript** — a training project to practice production-style patterns: auth, caching, background jobs, and performance optimization.

UI design inspired by the [Blocksy Blog template](https://startersites.io/blocksy/blog/) (independent project, not affiliated with or endorsed by Blocksy or Starter Sites).

---

## Features

- **Auth** — registration/login, JWT sessions, OAuth, protected routes, admin authorization, password reset, email verification
- **Articles** — categories, tags, search (`pg_trgm` GIN index), related/recommended articles, pagination
- **Comments & likes** — nested replies, likes on comments and articles, infinite scroll
- **For You** — personalized feed based on user interests and article tags, updated via a background job
- **Notifications** — user-level and global notifications with expiration
- **Caching** — Next.js SSR caching with tag-based revalidation, Redis (Cache-Aside) for dynamic article data, TanStack Query on the client
- **Security** — protected API routes, Redis-based rate limiting, input validation, CSP

---

## Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Axios
**Backend:** Next.js API Routes, Prisma, PostgreSQL, Redis
**Auth:** NextAuth, JWT, OAuth
**Infra:** Vercel, Cloudinary, QStash (Upstash)

---

## Architecture Notes

The Next.js app serves both frontend and API routes, backed by PostgreSQL (via Prisma), Redis for caching/rate limiting, and Cloudinary for images.

The **For You** recommendation update doesn't need to block the request, so it's offloaded to **QStash** (Upstash) — chosen since the app runs on Vercel's serverless platform, which has no persistent process for a traditional queue worker. Email and notifications are handled synchronously, not through the queue.

Prisma queries are optimized with `select` over `include`, `_count` instead of loading full relation arrays, and pagination on nested relations.

---

## Environment Variables

```env
DATABASE_URL=your value
UPSTASH_REDIS_REST_URL=your value
UPSTASH_REDIS_REST_TOKEN=your value
REDIS_URL=your value
NEXTAUTH_SECRET=your value
GITHUB_CLIENT_ID=your value
GITHUB_CLIENT_SECRET=your value
GOOGLE_CLIENT_ID=your value
GOOGLE_CLIENT_SECRET=your value
EMAIL_USER=your value
EMAIL_PASSWORD=your value
CLOUDINARY_URL=your value
QSTASH_URL=your value
QSTASH_TOKEN=your value
QSTASH_CURRENT_SIGNING_KEY=your value
QSTASH_NEXT_SIGNING_KEYrl=your value

```

Never commit `.env` or production secrets to GitHub.

---

## Getting Started

```bash
git clone https://github.com/hamzabatayneh0y0/blocksy_News.git
cd blocksy_News
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Runs at `http://localhost:3000`.

---

## Deployment

Deployed on Vercel with PostgreSQL, Redis, and Cloudinary as external services. CD is handled through Vercel's GitHub integration — every push to `main` builds and deploys automatically. No automated test suite yet.

---

## Status

🚧 Educational / training project — actively improved as I learn.

**Hamza Batayneh** · [GitHub](https://github.com/hamzabatayneh0y0)
