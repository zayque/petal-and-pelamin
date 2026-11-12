# Petal & Pelamin 🌸

Wedding booking platform for halls, wedding packages, pelamin (dais), bridal attire and photobooths.
Customers browse services, see live availability, reserve dates, pay a 30% deposit and get an invoice.
Admins manage services, bookings, the calendar, messages and customers.

**Stack:** Next.js 15 (App Router, Server Actions) · TypeScript · Tailwind CSS v4 · Prisma 6 · MySQL 8.4 (Docker)

---

## Quick start

### Option A: everything in Docker
```bash
cp .env.example .env            # then set AUTH_SECRET to a long random string
docker compose --profile app up -d --build
```
- Website → http://localhost:3000
- Adminer (DB GUI) → http://localhost:8081 (server `db`, user `petal`, pass `petalpass`)

The app container runs migrations and the seed on boot.

### Option B: develop locally, DB in Docker (hot reload)
```bash
cp .env.example .env
npm install
npm run db:up          # MySQL on localhost:3307 + Adminer on :8081
npx prisma migrate deploy
npm run db:seed
npm run dev            # http://localhost:3000
```

### Demo accounts (from the seed)
| Role | Email | Password |
|---|---|---|
| Admin | `admin@petalpelamin.my` | `Admin@12345` |
| Customer | `aisyah@example.com` | `Bride@2026` |

> Change `ADMIN_PASSWORD` and `AUTH_SECRET` before deploying anywhere public.

---

## Project structure
```
├── docker/                 entrypoint + MySQL init grants
├── docker-compose.yml      db (MySQL 8.4), adminer, app (profile "app")
├── Dockerfile              multi-stage, Next.js standalone output
├── prisma/
│   ├── schema.prisma       data model
│   ├── migrations/
│   └── seed.ts             services, packages A–D, admin & demo user
├── public/images/          halls/ dais/ dresses/ photobooth/ site/
├── src/
│   ├── app/
│   │   ├── (site)/         public site: home, services, packages, about, contact,
│   │   │                   cart, checkout, bookings/[code](/pay), account
│   │   ├── (auth)/         login, register
│   │   ├── admin/          overview, bookings, services CRUD, calendar, messages, customers
│   │   ├── actions/        server actions: auth, booking, contact, admin
│   │   └── uploads/[file]  serves admin-uploaded images
│   ├── components/         header, footer, cards, booking calendar, invoice, ui kit
│   ├── lib/                db, auth/session (JWT cookie), availability, catalog, formatting
│   └── middleware.ts       protects /account /cart /checkout /bookings /admin
└── legacy/                 the original PHP site, kept for reference (safe to delete)
```

## How booking works
1. A customer picks a date on a service. The calendar greys out dates that are already booked, blocked by an admin, or less than 14 days away.
2. Reserved items go to the **wishlist** (cart). Checkout re-checks every date, creates the booking (`PENDING_PAYMENT`) and empties the cart.
3. Paying the 30% deposit marks it `PAID`. Admins then move it to `CONFIRMED`, then `COMPLETED`, or `CANCELLED` (which frees the dates).

> **Payments are simulated.** To take real payments, plug a gateway (Billplz, ToyyibPay, Stripe…) into `payDeposit` in `src/app/actions/booking.ts` and confirm via webhook.

## Design system
Pastel-pink tokens live in `src/app/globals.css` (`blush-50…900`, plus `lilac`, `peach` and `mint` accents).
Fonts are Cormorant Garamond (display), Plus Jakarta Sans (body) and Great Vibes (script accents).
Reusable utilities: `btn-primary`, `btn-soft`, `btn-ghost`, `card`, `input`, `chip`, `eyebrow`.

## Useful scripts
| Command | What it does |
|---|---|
| `npm run db:up` / `db:down` | start / stop MySQL + Adminer |
| `npm run db:migrate` | create a new migration after editing `schema.prisma` |
| `npm run db:seed` | (re)seed; never overwrites admin edits |
| `npm run db:reset` | wipe and rebuild the database |
| `npm run db:studio` | Prisma Studio GUI |
| `npm run typecheck` | TypeScript check |

## Before going live
- Replace the placeholder marketing copy on the home page (stats like "1,200+ couples" and the testimonials) with real numbers and real reviews.
- Set a strong `AUTH_SECRET`, change the admin password, serve over HTTPS and set `INSECURE_COOKIES=0`.
- Connect a real payment gateway.
