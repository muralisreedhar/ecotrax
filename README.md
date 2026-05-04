# Ecotrax

Conservation intelligence platform that translates biodiversity data into specific, costed, accountable conservation action — and connects funders directly to practitioners who can execute it.

- **Spec:** [`docs/superpowers/specs/2026-05-03-ecotrax-mvp-design.md`](docs/superpowers/specs/2026-05-03-ecotrax-mvp-design.md)
- **Implementation phases:** [`docs/superpowers/plans/README.md`](docs/superpowers/plans/README.md)
- **Repo:** https://github.com/muralisreedhar/ecotrax

## Stack

Next.js 15 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind v3 + shadcn/ui (zinc palette) · Supabase (PostgreSQL + PostGIS + pgvector + pg_cron + pg_trgm) · Drizzle ORM · Vitest · GitHub Actions · Vercel.

H3 cell indices are computed in TypeScript via `h3-js` (added in Plan 2) and stored as `text` columns in Postgres — Supabase does not ship the `h3` extension.

## Local setup

### Prerequisites

- Node 20+, pnpm 9+
- A Supabase project (free tier is fine)
- (Optional, used in later plans) Anthropic, OpenAI, IUCN Red List, Global Forest Watch, Resend API keys

### First-time setup

```bash
cp .env.example .env.local
# fill in (from Supabase dashboard → Settings → API):
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  (starts with sb_publishable_)
#   SUPABASE_SECRET_KEY                    (starts with sb_secret_; server-only)
# and from Settings → Database → Connection string → URI (Direct connection):
#   DATABASE_URL

pnpm install
pnpm run db:migrate
pnpm run dev
```

App is at **http://localhost:3001** (port 3001 by default; change via the `dev` script if needed).

### Enable Supabase Auth providers

In the Supabase dashboard:
- **Authentication → Providers → Email**: enable
- **Authentication → Providers → Google** (optional): enable, set client ID/secret from Google Cloud Console; authorized redirect URI `https://<ref>.supabase.co/auth/v1/callback`
- **Authentication → URL Configuration**: Site URL `http://localhost:3001`, allow `http://localhost:3001/**` and your Vercel URL once deployed

### Promote a user to admin

After signing up at `/signup`, run [`scripts/promote-admin.sql`](scripts/promote-admin.sql) against the database (Supabase SQL Editor or `psql`) — replace `<email>` with the user's email.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run Turbopack dev server on port 3001 |
| `pnpm build` | Production build |
| `pnpm start` | Run production build |
| `pnpm test` | Run Vitest |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm typecheck` | TypeScript check (no emit) |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Drizzle Kit: generate migrations from schema |
| `pnpm db:migrate` | Apply all `db/migrations/*.sql` in order |
| `pnpm db:studio` | Drizzle Studio (DB browser) |

## Deploying to Vercel

1. Push to GitHub (`git push -u origin main`).
2. At [vercel.com/new](https://vercel.com/new), import the GitHub repo.
3. Vercel auto-detects Next.js. Confirm build command (`pnpm run build`) and install command (`pnpm install --frozen-lockfile`).
4. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `DATABASE_URL`). Plan-2+ keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `IUCN_API_TOKEN`, `GFW_API_KEY`, `RESEND_API_KEY`) can be added when those plans land.
5. Deploy. Once deployed, copy the production URL.
6. In Supabase **Authentication → URL Configuration**, set Site URL to the Vercel URL and add `https://<vercel-url>/**` to the redirect allow-list.

## Project layout

```
app/                 Next.js App Router routes (persona route groups)
  (auth)/            login, signup, OAuth callback
  (funder)/          marketplace, portfolio (gated; requireRole)
  (practitioner)/    projects, outcomes (gated)
  (generic)/         explore (any authenticated user)
  (explore)/         shared species + map routes
  admin/             admin console (gated; admin only)
components/
  ui/                shadcn primitives
  trust/             confidence chip, citation chip, data gaps panel,
                     provenance popover, AI disclosure badge,
                     "how was this generated" expander
  layout/            header, role switcher
db/
  schema/            Drizzle schema (enums, layer1-source, layer2-integration,
                     layer3-platform, ops)
  migrations/        SQL migrations applied in order:
                       0000_extensions.sql           — postgis, vector, pg_cron, pg_trgm, uuid-ossp
                       0001_*.sql                    — Layer 1 (source cache)
                       0002_*.sql                    — Layer 2 (integration)
                       0003_*.sql                    — Layer 3 + ops
                       0100_users_sync_trigger.sql   — auth.users → public.users
                       9999_rls.sql                  — RLS policies for every table
  client.ts          Drizzle client factory
  migrate.ts         Custom SQL migration runner
lib/
  supabase/          browser + server SSR clients, session-refresh middleware
  auth/              role helpers (getSessionUser, requireUser, requireRole),
                     sign-out + role-switch server actions
docs/superpowers/    Spec and per-phase implementation plans
```

## What ships in Plan 1 (this branch)

- Working sign-up + login (email; Google ready when you configure it)
- Persona-aware landing redirect (funder → /marketplace, practitioner → /projects, admin → /admin, other → /explore)
- Role-gated layouts with `requireRole`
- Header with sign-out and role switcher (admin role is non-switchable; assigned via SQL only)
- Six trust-UX components (confidence chip, citation chip, data gaps panel, provenance popover, AI disclosure badge, "how was this generated" expander) — TDD'd and reused everywhere AI output appears in later plans
- Full Layer 1 / Layer 2 / Layer 3 schema migrated to Supabase (37 application tables)
- Row-Level Security on every table (41 policies)
- `auth.users → public.users` sync trigger
- GitHub Actions CI (typecheck + lint + test + build)
- Vercel-ready config

## What's next

After Plan 1 lands, work proceeds plan-by-plan. See [`docs/superpowers/plans/README.md`](docs/superpowers/plans/README.md):

| # | Plan | Ships |
|---|---|---|
| 2 | Source Cache & ETL | GBIF / IUCN / WDPA / GFW / LandMark ingestion + species_id_map reconciliation |
| 3 | Integration Layer | species_profiles + species_location_assessments + cost_priors + intervention_outcomes seed |
| 4 | AI Layer | RAG retrieval, prompt versioning, intervention plan generation, validator, audit trail |
| 5 | Practitioner Experience | Project Builder, outcome reporting |
| 6 | Funder Experience | Marketplace, project detail, pledge flow, portfolio |
| 7 | Admin Console & Notifications | Moderation queues, Resend transactional email |
