# Blocksy News

A modern full-stack news and blogging platform built with **Next.js** and **TypeScript**.

This project was developed as a **training and educational project** to practice building a production-style web application, including authentication, database management, caching, content management, user interactions, and deployment.

The project's visual design is **inspired by and adapted from the Blocksy Blog template**:

[Blocksy Blog Template](https://startersites.io/blocksy/blog/)

> This is an independent educational project and is not affiliated with or endorsed by Blocksy or Starter Sites.

---

## Features

### Authentication

- User registration and login
- JWT-based authentication
- OAuth authentication
- Protected routes
- Admin authorization
- Password reset functionality
- Email verification

### Articles

- Browse news articles
- View individual articles
- Article categories and tags
- Search functionality (`pg_trgm` GIN index for scalable `ILIKE` search)
- Related articles and recommendations
- Pagination

### Comments & Interactions

- Add comments, reply to comments
- Like comments and articles
- Infinite scrolling for comments

### Personalized Content

A basic **For You** system that uses user interests and article tags to surface more relevant content. Interests update based on the articles a user interacts with.

### Notifications

- User notifications and global notifications
- Notification expiration
- Background processing for notification-related tasks

### Performance & Caching

- Server-side rendering and caching (Next.js)
- Cache revalidation with tag-based invalidation
- Redis caching for dynamic article data (Cache-Aside pattern)
- Client-side caching with TanStack Query
- Optimized Prisma queries (`select` over `include`, `_count` instead of full relation arrays, pagination for nested relations)
- Image optimization

### Security

- Protected API routes with JWT-based sessions
- Redis-based rate limiting
- Input validation
- Environment variable configuration
- Content Security Policy

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Axios

### Backend

- Next.js API Routes
- Node.js
- Prisma ORM
- PostgreSQL
- Redis

### Authentication

- NextAuth
- JWT
- OAuth

### Infrastructure

- PostgreSQL
- Redis
- Cloudinary
- Vercel

### Background Jobs

Background job processing is used for operations that don't need to block the user's request, such as:

- Sending emails
- Updating personalized content
- Processing notifications

---

## Architecture

```text
                    ┌──────────────────┐
                    │      Client      │
                    │   Browser / UI   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Next.js      │
                    │ App Router       │
                    │ Server/Client    │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌───────────┐  ┌──────────┐
        │ Prisma   │   │   Redis   │  │Cloudinary│
        │   ORM    │   │   Cache   │  │  Images  │
        └────┬─────┘   └───────────┘  └──────────┘
             │
             ▼
       ┌─────────────┐
       │ PostgreSQL  │
       │  Database   │
       └─────────────┘
```

```text
User Request
     │
     ▼
 Next.js
     │
     ├── Immediate response
     │
     └── Background Job
              │
              ▼
           Worker
              │
       ┌──────┴──────┐
       ▼             ▼
    Email        Notifications
                     │
                     ▼
               User Interests
```

---

## Database

PostgreSQL with Prisma as the ORM. Core entities include users, articles, categories, tags, comments, replies, likes, notifications, user interests, and auth accounts. Indexes are used where they meaningfully improve query performance (e.g. `pg_trgm` for search).

---

## Caching

**Server-side:** Next.js caching for data that doesn't need a DB hit on every request, with cache-tag based revalidation. Redis caches dynamic article data using the Cache-Aside pattern with managed TTLs.

**Client-side:** TanStack Query for comments, article interactions, and other dynamic data — reduces redundant requests.

---

## Rate Limiting

API endpoints are protected using Redis-based rate limiting to prevent excessive requests.

---

## Image Management

Images are handled with Cloudinary, with frontend-side compression before upload to reduce bandwidth usage.

---

## Environment Variables

Create a `.env` file in the root directory.

```env
DATABASE_URL=your_database_url

AUTH_SECRET=your_auth_secret

NEXTAUTH_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

REDIS_URL=your_redis_url
```

The exact environment variables may vary depending on the deployment configuration.

**Never commit your `.env` file or production secrets to GitHub.**

---

## Installation

```bash
git clone https://github.com/hamzabatayneh0y0/blocksy_News.git
cd blocksy_News
npm install
```

---

## Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

---

## Development

```bash
npm run dev
```

Available at `http://localhost:3000`.

---

## Production

```bash
npm run build
npm start
```

---

## Deployment

Deployed on Vercel, with PostgreSQL, Redis, and Cloudinary hosted as external services. Continuous deployment is handled through Vercel's GitHub integration — every push to the main branch is built and deployed automatically.

> No automated test suite yet — this is on the roadmap.

---

## What I Learned

- Next.js App Router, React Server Components, Client Components
- Authentication and authorization (OAuth, JWT sessions)
- PostgreSQL, Prisma, database indexing
- Redis and caching strategies
- Rate limiting and background jobs
- API design
- Image optimization with Cloudinary
- Cloud deployment and performance optimization
- Security practices
- Full-stack application architecture

---

## Design Credits

UI design inspired by the [Blocksy Blog template](https://startersites.io/blocksy/blog/). The original design belongs to its respective creators; this project is an independent implementation for educational purposes.

---

## Project Status

**Educational / Training Project** — may continue to receive improvements, refactoring, and additional features.

---

## Author

**Hamza Batayneh**
GitHub: https://github.com/hamzabatayneh0y0
