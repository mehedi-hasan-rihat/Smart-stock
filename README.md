# SmartStock

An inventory management system for small retail businesses. Track products, record sales, and use AI to generate professional product descriptions — built with Next.js 16, Prisma 7, PostgreSQL, and OpenRouter.

---

## Features

- **Product management** — add, edit, delete products with name, price, stock, and description
- **Sales recording** — sell single or multiple products at once, with optional customer info
- **Low stock alerts** — products at or below threshold are flagged in the table and detail view
- **AI description generator** — write short notes, get a polished product description via OpenRouter
- **Paginated sales history** — browse all past transactions with item-level detail
- **JWT authentication** — session-based login with secure httpOnly cookies

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | `jose` (JWT, HS256) |
| AI | OpenRouter (`dots-studio/dots-3-note-preview:free`) |
| Styling | Tailwind CSS v4 |
| Validation | Zod |

---

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL running locally (or a connection string to a hosted instance)
- An OpenRouter API key — get one free at [openrouter.ai/keys](https://openrouter.ai/keys)

### 1. Clone and install

```bash
git clone <repo-url>
cd smartstock
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/smartstock"
JWT_SECRET="a-long-random-secret"
OPENROUTER_API_KEY="sk-or-v1-..."
```

### 3. Run database migrations

```bash
npx prisma migrate deploy
```

### 4. Seed demo data (optional)

Populates a demo account with 10 products and ~93 days of sales history.

```bash
npx tsx prisma/seed.ts
```

Demo credentials:

```
Email:    demo@smartstock.dev
Password: password123
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Building for production

```bash
npm run build
npm start
```

The build script runs `prisma generate` automatically before `next build`.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login and register pages
│   ├── api/
│   │   ├── auth/         # Login, register, logout routes
│   │   ├── products/     # CRUD endpoints
│   │   ├── sales/        # Sales list + create endpoint
│   │   └── ai/
│   │       └── describe/ # AI description generation
│   └── dashboard/        # Products, sales, overview pages
├── features/
│   ├── products/         # ProductTable, ProductModal, SellModal, etc.
│   ├── sales/            # SalesTable, SalesView, Pagination
│   └── ai/               # (reserved for future AI features)
├── components/ui/        # Button, Input, Modal, Toast
└── lib/                  # Prisma client, auth, session, cache, OpenRouter client
prisma/
├── schema/               # Split Prisma schema files
├── migrations/           # Migration history
└── seed.ts               # Demo data seeder
```

---

## Key APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a merchant account |
| POST | `/api/auth/login` | Authenticate and set session cookie |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/products` | List all products for the session merchant |
| POST | `/api/products` | Create a product |
| PATCH | `/api/products/[id]` | Update a product |
| DELETE | `/api/products/[id]` | Delete a product |
| GET | `/api/sales?page=&limit=` | Paginated sales list |
| POST | `/api/sales` | Record a sale (decrements stock) |
| POST | `/api/ai/describe` | Generate a product description via OpenRouter |

---

## AI Feature

The description generator lives at `POST /api/ai/describe`. It accepts `{ name, notes }` and returns `{ description }`.

In the product form, type a product name and add brief notes in the description field, then click **✦ AI generate**. The model (`dots-studio/dots-3-note-preview:free` via OpenRouter) expands your notes into a polished 2–3 sentence retail description.

The model and client are configured in `src/lib/constants.ts` and `src/lib/openrouter.ts`.

---

## Architecture Notes

- **Caching** — product and sales lists use Next.js `"use cache"` with `cacheTag` for per-merchant invalidation. Tags are revalidated on every write.
- **Prisma schema** — split across `prisma/schema/` files (base, merchant, product, sale) and merged at generate time via `prisma7.config.ts`.
- **Auth flow** — password hashed with bcrypt, signed into a 7-day JWT stored as an httpOnly cookie. `getSession()` is called at the top of every API route and server component.
- **Sale integrity** — stock deduction and sale creation happen inside a Prisma `$transaction` to prevent partial writes.

---

## Known Limitations

- No role-based access; every registered account is a merchant with full access to their own data
- The AI description generator requires an active OpenRouter API key and internet access
- No image upload support for products
- Stock can go negative if concurrent sales race — a database-level constraint would prevent this in production
- No email verification on registration
