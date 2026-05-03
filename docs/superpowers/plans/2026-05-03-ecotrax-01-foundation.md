# Ecotrax MVP — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a deployable Next.js 15 + Supabase application with the complete Layer 1–3 schema, RLS policies, Supabase Auth + role picker, persona route shells, trust-UX components, admin role seeding, GitHub Actions CI, and Vercel deploy.

**Architecture:** Single Next.js 15 App Router monorepo on Vercel. Supabase provides Postgres (with PostGIS, pgvector, pg_cron, h3-pg), Auth, Storage, and Realtime. Drizzle ORM defines schema in TypeScript and generates SQL migrations; raw SQL migrations alongside cover extensions and RLS policies. Trust-UX primitives (ConfidenceChip, CitationChip, etc.) are scaffolded now so every later plan can use them.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, Tailwind v4, shadcn/ui, Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Drizzle ORM + drizzle-kit, Zod, Vitest, @testing-library/react, pnpm 9, GitHub Actions, Vercel.

**Spec reference:** [docs/superpowers/specs/2026-05-03-ecotrax-mvp-design.md](../specs/2026-05-03-ecotrax-mvp-design.md)

---

## File Structure

```
ecotrax/
├── .env.example
├── .env.local                              # gitignored
├── .gitignore
├── .github/workflows/ci.yml                # typecheck + lint + build + test
├── README.md
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json                         # shadcn config
├── drizzle.config.ts
├── vitest.config.ts
├── vercel.json
│
├── app/
│   ├── layout.tsx                          # root layout
│   ├── page.tsx                            # marketing landing
│   ├── globals.css
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts
│   │
│   ├── (funder)/
│   │   ├── layout.tsx                      # funder nav
│   │   ├── marketplace/page.tsx            # placeholder
│   │   └── portfolio/page.tsx              # placeholder
│   │
│   ├── (practitioner)/
│   │   ├── layout.tsx                      # practitioner nav
│   │   ├── projects/page.tsx               # placeholder
│   │   └── outcomes/page.tsx               # placeholder
│   │
│   ├── (generic)/
│   │   ├── layout.tsx
│   │   └── explore/page.tsx                # placeholder
│   │
│   ├── (explore)/
│   │   └── map/page.tsx                    # placeholder
│   │
│   └── admin/
│       ├── layout.tsx                      # role-gated
│       └── page.tsx                        # placeholder
│
├── components/
│   ├── ui/                                 # shadcn primitives
│   ├── trust/
│   │   ├── confidence-chip.tsx
│   │   ├── citation-chip.tsx
│   │   ├── data-gaps-panel.tsx
│   │   ├── provenance-popover.tsx
│   │   ├── ai-disclosure-badge.tsx
│   │   └── how-was-this-generated.tsx
│   └── layout/
│       ├── header.tsx
│       └── role-switcher.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # browser client
│   │   ├── server.ts                       # server client (RSC + Route Handlers)
│   │   └── middleware.ts                   # session refresh helper
│   ├── auth/
│   │   ├── actions.ts                      # signOut server action
│   │   └── role.ts                         # readRole, requireRole helpers
│   └── utils.ts                            # cn() and friends
│
├── db/
│   ├── schema/
│   │   ├── index.ts                        # re-exports
│   │   ├── enums.ts                        # all pgEnum types
│   │   ├── layer1-source.ts                # src_* + species_id_map
│   │   ├── layer2-integration.ts           # species_profiles, …assessments, etc.
│   │   ├── layer3-platform.ts              # users, projects, ai_outputs, etc.
│   │   └── ops.ts                          # materialization_jobs, source_refresh_log
│   ├── migrations/
│   │   ├── 0000_extensions.sql             # raw SQL: enable extensions
│   │   ├── 0001_*.sql                      # drizzle-kit generated tables
│   │   └── 9999_rls.sql                    # raw SQL: RLS policies
│   ├── client.ts                           # Drizzle client factory
│   ├── migrate.ts                          # runs all migrations in order
│   └── types.ts                            # InferSelectModel/InferInsertModel exports
│
├── middleware.ts                           # Next.js middleware: auth + role gating
│
├── scripts/
│   └── promote-admin.sql                   # one-off: SET role = 'admin' for a user
│
└── tests/
    └── components/
        └── trust/                          # tests for trust-UX components
```

---

## Task 1: Initialize git repository

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Confirm current directory and absence of git repo**

Run: `pwd && ls -la`
Expected: working directory is `/Users/msreedhar/Documents/Projects/Ecotrax`; no `.git` directory present (only the PRD and `docs/`).

- [ ] **Step 2: Initialize git repo**

```bash
git init -b main
```

Expected: `Initialized empty Git repository in …/Ecotrax/.git/`.

- [ ] **Step 3: Create .gitignore**

Write `.gitignore`:

```gitignore
# deps
node_modules/
.pnpm-store/

# build
.next/
out/
dist/
build/

# env
.env
.env.local
.env.*.local

# logs
*.log
npm-debug.log*
pnpm-debug.log*

# os / editors
.DS_Store
.vscode/
.idea/
*.swp
*.swo

# test
coverage/
.vitest/

# vercel
.vercel/

# supabase
supabase/.temp/
supabase/.branches/

# misc
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 4: First commit**

```bash
git add .gitignore Ecotrax_PRD.md docs/
git commit -m "chore: initial commit with PRD and design spec"
```

Expected: commit succeeds; `git log --oneline` shows one commit.

---

## Task 2: Scaffold Next.js 15

**Files:**
- Create: full Next.js project structure

- [ ] **Step 1: Verify pnpm is installed**

Run: `pnpm --version`
Expected: `9.x` or higher. If not installed: `npm install -g pnpm`.

- [ ] **Step 2: Scaffold Next.js into the current directory**

```bash
pnpm create next-app@15.1.4 . \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --use-pnpm
```

When prompted "directory is not empty, continue?": yes. The CLI preserves `.gitignore`, `Ecotrax_PRD.md`, and `docs/`.

Expected: `package.json`, `app/`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `app/page.tsx`, `app/layout.tsx`, `app/globals.css` created.

- [ ] **Step 3: Verify build works out of the box**

```bash
pnpm install
pnpm run build
```

Expected: build succeeds; `.next/` directory created.

- [ ] **Step 4: Verify dev server runs**

```bash
pnpm run dev
```

Open `http://localhost:3000` — default Next.js page should render. Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js 15 with TypeScript and Tailwind"
```

---

## Task 3: Install core dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Supabase, Drizzle, Zod, validation libraries**

```bash
pnpm add @supabase/supabase-js@2.45 @supabase/ssr@0.5 \
  drizzle-orm@0.36 postgres@3.4 \
  zod@3.23
```

- [ ] **Step 2: Install dev dependencies (Drizzle Kit, Vitest, testing-library)**

```bash
pnpm add -D drizzle-kit@0.28 \
  vitest@2.1 @vitest/ui@2.1 \
  @testing-library/react@16.1 @testing-library/dom@10.4 @testing-library/jest-dom@6.6 \
  jsdom@25 \
  @types/node@22 dotenv@16
```

- [ ] **Step 3: Verify all installed**

Run: `pnpm list --depth=0 | head -30`
Expected: lists each package above with the right major version.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install Supabase, Drizzle, Zod, Vitest, testing-library"
```

---

## Task 4: Set up env files and project folder structure

**Files:**
- Create: `.env.example`
- Create: `.env.local` (gitignored)
- Create: `lib/`, `db/`, `db/schema/`, `db/migrations/`, `components/trust/`, `components/layout/`, `tests/`, `scripts/`

- [ ] **Step 1: Write .env.example**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Direct Postgres connection (for Drizzle migrations + server-side direct queries)
# In Supabase dashboard: Settings → Database → Connection string → URI (use the
# "Transaction" pooler for serverless, or "Direct connection" for migrations).
DATABASE_URL=postgresql://postgres.<ref>:<password>@<host>:5432/postgres

# AI providers (used in Plan 4; safe to leave blank for now)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# External data sources (used in Plan 2; safe to leave blank for now)
IUCN_API_TOKEN=
GFW_API_KEY=

# Email (used in Plan 7; safe to leave blank for now)
RESEND_API_KEY=
```

- [ ] **Step 2: Copy `.env.example` to `.env.local` and fill the Supabase values**

```bash
cp .env.example .env.local
```

User action: open `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `DATABASE_URL` from the Supabase dashboard (Settings → API + Settings → Database).

- [ ] **Step 3: Create folder skeleton**

```bash
mkdir -p lib/supabase lib/auth db/schema db/migrations \
  components/trust components/layout \
  tests/components/trust scripts \
  app/\(auth\)/login app/\(auth\)/signup app/\(auth\)/callback \
  app/\(funder\)/marketplace app/\(funder\)/portfolio \
  app/\(practitioner\)/projects app/\(practitioner\)/outcomes \
  app/\(generic\)/explore app/\(explore\)/map app/admin
```

- [ ] **Step 4: Verify .env.local is gitignored**

```bash
git status
```

Expected: `.env.local` does NOT appear in untracked files (it's covered by `.gitignore`).

- [ ] **Step 5: Commit**

```bash
git add .env.example
git commit -m "chore: add env template and project folder structure"
```

---

## Task 5: Initialize shadcn/ui

**Files:**
- Create: `components.json`
- Create: `components/ui/*`
- Modify: `app/globals.css`, `tailwind.config.ts`

- [ ] **Step 1: Initialize shadcn**

```bash
pnpm dlx shadcn@latest init
```

Answers:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**
- Tailwind config: accept default
- Components alias: `@/components`
- Utils alias: `@/lib/utils`
- React Server Components: **Yes**

Expected: `components.json` created; `app/globals.css` updated with theme tokens; `lib/utils.ts` created with `cn()`.

- [ ] **Step 2: Add base shadcn primitives we'll need across plans**

```bash
pnpm dlx shadcn@latest add button card dialog input label \
  select tabs toast badge sheet form popover separator avatar \
  dropdown-menu skeleton textarea tooltip
```

Expected: each component file created under `components/ui/`.

- [ ] **Step 3: Verify build still passes**

```bash
pnpm run build
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
git add components.json components/ui lib/utils.ts app/globals.css tailwind.config.ts package.json pnpm-lock.yaml
git commit -m "feat: initialize shadcn/ui with base primitives"
```

---

## Task 6: Configure Vitest

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (scripts)
- Modify: `tsconfig.json` (types)

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
})
```

- [ ] **Step 2: Install @vitejs/plugin-react**

```bash
pnpm add -D @vitejs/plugin-react@4.3
```

- [ ] **Step 3: Create vitest.setup.ts**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Add test scripts to package.json**

Edit `package.json` `scripts`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 5: Add vitest globals to tsconfig.json**

Edit `tsconfig.json` `compilerOptions.types`:

```json
"types": ["vitest/globals", "@testing-library/jest-dom"]
```

- [ ] **Step 6: Write a sanity test**

Create `tests/sanity.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('sanity', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 7: Run it**

Run: `pnpm test`
Expected: 1 passed.

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts vitest.setup.ts tests/sanity.test.ts package.json pnpm-lock.yaml tsconfig.json
git commit -m "chore: configure Vitest with jsdom and testing-library"
```

---

## Task 7: Build Trust-UX components (TDD)

These are required next to every AI output and numerical claim per spec §6.6. Build them now so later plans can compose them.

**Files:**
- Create: `components/trust/confidence-chip.tsx`
- Create: `components/trust/citation-chip.tsx`
- Create: `components/trust/data-gaps-panel.tsx`
- Create: `components/trust/provenance-popover.tsx`
- Create: `components/trust/ai-disclosure-badge.tsx`
- Create: `components/trust/how-was-this-generated.tsx`
- Create: corresponding tests under `tests/components/trust/`

- [ ] **Step 1: Write failing test for ConfidenceChip**

Create `tests/components/trust/confidence-chip.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ConfidenceChip } from '@/components/trust/confidence-chip'

describe('ConfidenceChip', () => {
  it('renders score and band label', () => {
    render(<ConfidenceChip score={71} band="moderate" />)
    expect(screen.getByText(/71/)).toBeInTheDocument()
    expect(screen.getByText(/moderate/i)).toBeInTheDocument()
  })

  it('clamps score to 0-100', () => {
    render(<ConfidenceChip score={150} band="very_high" />)
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('formats band labels with title-case spacing', () => {
    render(<ConfidenceChip score={20} band="very_high" />)
    expect(screen.getByText(/Very High/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to confirm failure**

Run: `pnpm test -- confidence-chip`
Expected: FAIL (component does not exist).

- [ ] **Step 3: Implement ConfidenceChip**

Create `components/trust/confidence-chip.tsx`:

```tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type ConfidenceBand = 'low' | 'moderate' | 'high' | 'very_high'

const BAND_LABEL: Record<ConfidenceBand, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  very_high: 'Very High',
}

const BAND_CLASS: Record<ConfidenceBand, string> = {
  low: 'bg-red-100 text-red-900 border-red-200',
  moderate: 'bg-amber-100 text-amber-900 border-amber-200',
  high: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  very_high: 'bg-emerald-200 text-emerald-950 border-emerald-300',
}

export interface ConfidenceChipProps {
  score: number
  band: ConfidenceBand
  className?: string
}

export function ConfidenceChip({ score, band, className }: ConfidenceChipProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', BAND_CLASS[band], className)}>
      <span aria-label="confidence score">{clamped}</span>
      <span className="text-xs opacity-80">· {BAND_LABEL[band]}</span>
    </Badge>
  )
}
```

- [ ] **Step 4: Run test to confirm pass**

Run: `pnpm test -- confidence-chip`
Expected: 3 passed.

- [ ] **Step 5: Write failing test for CitationChip**

Create `tests/components/trust/citation-chip.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CitationChip } from '@/components/trust/citation-chip'

describe('CitationChip', () => {
  it('renders count of source ids', () => {
    render(<CitationChip sources={['intervention_outcomes:1234', 'cost_priors:55']} />)
    expect(screen.getByText('2 sources')).toBeInTheDocument()
  })

  it('uses singular label for one source', () => {
    render(<CitationChip sources={['species_profiles:42']} />)
    expect(screen.getByText('1 source')).toBeInTheDocument()
  })

  it('renders nothing when sources is empty', () => {
    const { container } = render(<CitationChip sources={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
```

- [ ] **Step 6: Run test to confirm failure**

Run: `pnpm test -- citation-chip`
Expected: FAIL.

- [ ] **Step 7: Implement CitationChip**

Create `components/trust/citation-chip.tsx`:

```tsx
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface CitationChipProps {
  sources: string[]
  className?: string
}

export function CitationChip({ sources, className }: CitationChipProps) {
  if (sources.length === 0) return null
  const label = `${sources.length} source${sources.length === 1 ? '' : 's'}`
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge variant="secondary" className={cn('cursor-pointer', className)}>
          {label}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-72 text-xs">
        <p className="mb-2 font-medium">Cited sources</p>
        <ul className="space-y-1">
          {sources.map((s) => (
            <li key={s} className="font-mono text-muted-foreground">{s}</li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
```

- [ ] **Step 8: Run test to confirm pass**

Run: `pnpm test -- citation-chip`
Expected: 3 passed.

- [ ] **Step 9: Write failing test for DataGapsPanel**

Create `tests/components/trust/data-gaps-panel.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DataGapsPanel } from '@/components/trust/data-gaps-panel'

describe('DataGapsPanel', () => {
  it('renders heading and bullet list of gaps', () => {
    render(<DataGapsPanel gaps={['No occurrences since 2018', 'Cost priors n=3']} />)
    expect(screen.getByRole('heading', { name: /what we don['’]t know/i })).toBeInTheDocument()
    expect(screen.getByText(/No occurrences since 2018/)).toBeInTheDocument()
    expect(screen.getByText(/Cost priors n=3/)).toBeInTheDocument()
  })

  it('shows fallback when no gaps', () => {
    render(<DataGapsPanel gaps={[]} />)
    expect(screen.getByText(/no significant data gaps/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 10: Run, fail, implement**

Run: `pnpm test -- data-gaps-panel` → FAIL.

Create `components/trust/data-gaps-panel.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface DataGapsPanelProps {
  gaps: string[]
}

export function DataGapsPanel({ gaps }: DataGapsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">What we don&rsquo;t know</CardTitle>
      </CardHeader>
      <CardContent>
        {gaps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No significant data gaps for this view.</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {gaps.map((g) => <li key={g}>{g}</li>)}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
```

Run: `pnpm test -- data-gaps-panel` → 2 passed.

- [ ] **Step 11: Implement remaining trust components (test-then-build pattern)**

For each of the three remaining components, follow the same TDD cadence: write test, run-fail, implement, run-pass.

**`components/trust/provenance-popover.tsx`:**

Test (`tests/components/trust/provenance-popover.test.tsx`):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProvenancePopover } from '@/components/trust/provenance-popover'

describe('ProvenancePopover', () => {
  it('renders trigger with source count label', () => {
    render(
      <ProvenancePopover
        sources={[
          { source: 'gbif', updated_at: '2026-04-01' },
          { source: 'iucn', updated_at: '2026-03-15' },
        ]}
      />,
    )
    expect(screen.getByRole('button', { name: /provenance/i })).toBeInTheDocument()
  })
})
```

Implementation:

```tsx
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface ProvenanceSource {
  source: string
  updated_at: string
  detail?: string
}

export interface ProvenancePopoverProps {
  sources: ProvenanceSource[]
}

export function ProvenancePopover({ sources }: ProvenancePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" aria-label="provenance">
          Provenance ({sources.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 text-xs">
        <p className="mb-2 font-medium">Sources contributing to this view</p>
        <ul className="space-y-1.5">
          {sources.map((s, i) => (
            <li key={`${s.source}-${i}`} className="flex justify-between gap-2">
              <span className="font-medium">{s.source}</span>
              <span className="text-muted-foreground">updated {s.updated_at}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
```

**`components/trust/ai-disclosure-badge.tsx`:**

Test (`tests/components/trust/ai-disclosure-badge.test.tsx`):

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AIDisclosureBadge } from '@/components/trust/ai-disclosure-badge'

describe('AIDisclosureBadge', () => {
  it('renders unreviewed warning', () => {
    render(<AIDisclosureBadge tier="unreviewed" />)
    expect(screen.getByText(/AI generated/i)).toBeInTheDocument()
    expect(screen.getByText(/unreviewed/i)).toBeInTheDocument()
  })
  it('renders reviewed acknowledgement', () => {
    render(<AIDisclosureBadge tier="reviewed" reviewer="Dr. Asha Patel" />)
    expect(screen.getByText(/Dr\. Asha Patel/)).toBeInTheDocument()
  })
})
```

Implementation:

```tsx
import { Badge } from '@/components/ui/badge'

export interface AIDisclosureBadgeProps {
  tier: 'unreviewed' | 'reviewed'
  reviewer?: string
}

export function AIDisclosureBadge({ tier, reviewer }: AIDisclosureBadgeProps) {
  if (tier === 'reviewed') {
    return (
      <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-900">
        AI generated · reviewed{reviewer ? ` by ${reviewer}` : ''}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
      AI generated · unreviewed
    </Badge>
  )
}
```

**`components/trust/how-was-this-generated.tsx`:**

Test (`tests/components/trust/how-was-this-generated.test.tsx`):

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HowWasThisGenerated } from '@/components/trust/how-was-this-generated'

describe('HowWasThisGenerated', () => {
  it('expands to show prompt version and retrieval sources on click', () => {
    render(
      <HowWasThisGenerated
        outputId="ai_outputs:42"
        promptVersion="plan-v1.0.0"
        retrievalSources={['species_profiles:88', 'cost_priors:7']}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /how was this generated/i }))
    expect(screen.getByText(/plan-v1\.0\.0/)).toBeInTheDocument()
    expect(screen.getByText(/species_profiles:88/)).toBeInTheDocument()
    expect(screen.getByText(/cost_priors:7/)).toBeInTheDocument()
  })
})
```

Implementation:

```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export interface HowWasThisGeneratedProps {
  outputId: string
  promptVersion: string
  retrievalSources: string[]
}

export function HowWasThisGenerated({
  outputId,
  promptVersion,
  retrievalSources,
}: HowWasThisGeneratedProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="text-xs">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2"
        onClick={() => setOpen((v) => !v)}
      >
        How was this generated?
      </Button>
      {open && (
        <div className="mt-2 rounded border bg-muted/50 p-3 font-mono">
          <p>output: {outputId}</p>
          <p>prompt: {promptVersion}</p>
          <p className="mt-1">retrieval:</p>
          <ul className="ml-4 list-disc">
            {retrievalSources.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
```

Run all trust tests: `pnpm test -- trust` → all pass.

- [ ] **Step 12: Commit**

```bash
git add components/trust tests/components/trust
git commit -m "feat: trust-UX component scaffolds (confidence, citation, data gaps, provenance, disclosure, how-was-this-generated)"
```

---

## Task 8: Configure Drizzle ORM and migration runner

**Files:**
- Create: `drizzle.config.ts`
- Create: `db/client.ts`
- Create: `db/migrate.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Write drizzle.config.ts**

```ts
import { defineConfig } from 'drizzle-kit'
import 'dotenv/config'

export default defineConfig({
  schema: './db/schema/index.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
```

- [ ] **Step 2: Write db/client.ts**

```ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

declare global {
  // eslint-disable-next-line no-var
  var __pg: ReturnType<typeof postgres> | undefined
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required')

const client = global.__pg ?? postgres(connectionString, { prepare: false })
if (process.env.NODE_ENV !== 'production') global.__pg = client

export const db = drizzle(client, { schema })
export type Db = typeof db
```

- [ ] **Step 3: Write db/migrate.ts**

This is the migration runner — it applies SQL files in `db/migrations/` in lexicographic order. We use raw SQL files for portability (extensions, RLS, Drizzle-generated, all live together).

```ts
import 'dotenv/config'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import postgres from 'postgres'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is required')

  const sql = postgres(url, { max: 1 })
  const dir = join(process.cwd(), 'db', 'migrations')
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()

  await sql`CREATE TABLE IF NOT EXISTS _migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`

  const applied = new Set(
    (await sql`SELECT name FROM _migrations`).map((r: { name: string }) => r.name),
  )

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip  ${file}`)
      continue
    }
    console.log(`apply ${file}`)
    const body = readFileSync(join(dir, file), 'utf8')
    await sql.unsafe(body)
    await sql`INSERT INTO _migrations (name) VALUES (${file})`
  }

  await sql.end()
  console.log('migrations complete')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

- [ ] **Step 4: Add db scripts to package.json**

Edit `package.json` `scripts` section, append:

```json
"db:generate": "drizzle-kit generate",
"db:migrate": "tsx db/migrate.ts",
"db:studio": "drizzle-kit studio"
```

- [ ] **Step 5: Install tsx**

```bash
pnpm add -D tsx@4.19
```

- [ ] **Step 6: Verify the runner compiles (won't run yet — no migrations exist)**

```bash
pnpm exec tsc --noEmit
```

Expected: no type errors. (`db/schema/index.ts` doesn't exist yet but the runner doesn't import it directly; `db/client.ts` does, but Drizzle's `import * as schema` accepts an empty module — we'll address this once schema files exist.)

If `db/client.ts` fails the typecheck because `./schema` is missing, create a placeholder:

```ts
// db/schema/index.ts
export {}
```

Re-run typecheck → passes.

- [ ] **Step 7: Commit**

```bash
git add drizzle.config.ts db/ package.json pnpm-lock.yaml
git commit -m "chore: configure Drizzle ORM with custom SQL migration runner"
```

---

## Task 9: Migration 0000 — enable PostgreSQL extensions

**Files:**
- Create: `db/migrations/0000_extensions.sql`

- [ ] **Step 1: Write extension migration**

Create `db/migrations/0000_extensions.sql`:

```sql
-- Required extensions for Ecotrax
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS h3;
CREATE EXTENSION IF NOT EXISTS h3_postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;     -- fuzzy text matching for species_id_map
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- uuid_generate_v4()
```

> **Note on Supabase extensions:** `postgis`, `vector`, `pg_cron`, `pg_trgm`, and `uuid-ossp` are all in Supabase's allowlist. `h3` and `h3_postgis` are in Supabase's extension catalog but may need to be enabled via the **Database → Extensions** UI before running migrations. If migration fails on `CREATE EXTENSION IF NOT EXISTS h3`, enable both `h3` and `h3_postgis` from the Supabase dashboard, then re-run.

- [ ] **Step 2: Run migration**

```bash
pnpm run db:migrate
```

Expected output: `apply 0000_extensions.sql`, then `migrations complete`. If `h3` fails, follow the note above and re-run.

- [ ] **Step 3: Verify extensions are installed**

In Supabase SQL editor or via `psql`:

```sql
SELECT extname FROM pg_extension
WHERE extname IN ('postgis','vector','pg_cron','h3','h3_postgis','pg_trgm','uuid-ossp')
ORDER BY extname;
```

Expected: 7 rows.

- [ ] **Step 4: Commit**

```bash
git add db/migrations/0000_extensions.sql
git commit -m "feat(db): enable postgis, vector, pg_cron, h3, pg_trgm, uuid-ossp extensions"
```

---

## Task 10: Drizzle schema — enums and Layer 1 tables

**Files:**
- Create: `db/schema/enums.ts`
- Create: `db/schema/layer1-source.ts`
- Modify: `db/schema/index.ts`

- [ ] **Step 1: Write enums**

Create `db/schema/enums.ts`:

```ts
import { pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['funder', 'practitioner', 'other', 'admin'])

export const orgVerificationStatusEnum = pgEnum('org_verification_status', [
  'unverified', 'verified', 'rejected',
])

export const projectStatusEnum = pgEnum('project_status', [
  'draft', 'submitted', 'listed', 'funded', 'closed',
])

export const milestoneStatusEnum = pgEnum('milestone_status', ['pending', 'completed'])

export const fundingCommitmentStatusEnum = pgEnum('funding_commitment_status', [
  'pledged', 'confirmed', 'disbursed',
])

export const outcomeReportStatusEnum = pgEnum('outcome_report_status', [
  'submitted', 'verified', 'disputed',
])

export const verificationTierEnum = pgEnum('verification_tier', ['auto', 'peer', 'expert'])

export const presenceTypeEnum = pgEnum('presence_type', [
  'observed', 'inferred_high', 'inferred_med', 'inferred_low',
])

export const confidenceBandEnum = pgEnum('confidence_band', [
  'low', 'moderate', 'high', 'very_high',
])

export const aiCapabilityEnum = pgEnum('ai_capability', ['plan', 'qa', 'match'])

export const matchMethodEnum = pgEnum('match_method', [
  'exact', 'synonym', 'fuzzy', 'manual',
])

export const materializationStatusEnum = pgEnum('materialization_status', [
  'queued', 'running', 'success', 'failed',
])
```

- [ ] **Step 2: Write Layer 1 schema**

Create `db/schema/layer1-source.ts`:

```ts
import {
  pgTable, bigserial, integer, text, jsonb, timestamp, real,
  boolean, doublePrecision, customType,
} from 'drizzle-orm/pg-core'
import { matchMethodEnum } from './enums'

// PostGIS geometry (WKT/WKB transparent via PostGIS) — text in TS, validated server-side
export const geometry = customType<{ data: string; driverData: string }>({
  dataType: () => 'geometry',
})

// H3 cell index (uint64 in DB; bigint in TS via string for safety)
export const h3Index = customType<{ data: string; driverData: string }>({
  dataType: () => 'h3index',
})

export const speciesIdMap = pgTable('species_id_map', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  canonicalSpeciesId: integer('canonical_species_id').notNull(),
  sourceSystem: text('source_system').notNull(),    // 'gbif' | 'iucn' | 'birdlife' | 'ebird' | 'obis'
  sourceId: text('source_id').notNull(),
  matchMethod: matchMethodEnum('match_method').notNull(),
  matchConfidence: real('match_confidence').notNull(),
  manualOverride: boolean('manual_override').notNull().default(false),
  reconciledAt: timestamp('reconciled_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcGbifOccurrences = pgTable('src_gbif_occurrences', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  gbifKey: integer('gbif_key').notNull(),                  // GBIF taxonKey
  occurrenceId: text('occurrence_id').notNull().unique(),  // GBIF gbifID
  location: geometry('location').notNull(),                // POINT
  h3R5: h3Index('h3_r5'),
  h3R6: h3Index('h3_r6'),
  h3R7: h3Index('h3_r7'),
  observedAt: timestamp('observed_at', { withTimezone: true }),
  source: text('source'),                                  // dataset within GBIF
  coordinateUncertaintyM: doublePrecision('coordinate_uncertainty_m'),
  taxonVerified: boolean('taxon_verified').default(false),
  rawPayload: jsonb('raw_payload'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcIucnAssessments = pgTable('src_iucn_assessments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  iucnId: integer('iucn_id').notNull().unique(),
  scientificName: text('scientific_name').notNull(),
  iucnStatus: text('iucn_status'),
  populationTrend: text('population_trend'),
  assessmentDate: timestamp('assessment_date', { withTimezone: true }),
  threatsRaw: jsonb('threats_raw'),
  narrativesRaw: jsonb('narratives_raw'),
  rawPayload: jsonb('raw_payload'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcIucnRanges = pgTable('src_iucn_ranges', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  iucnId: integer('iucn_id').notNull(),
  rangePolygon: geometry('range_polygon').notNull(),
  presenceCode: integer('presence_code'),
  originCode: integer('origin_code'),
  seasonalCode: integer('seasonal_code'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcWdpaAreas = pgTable('src_wdpa_areas', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  wdpaId: integer('wdpa_id').notNull().unique(),
  name: text('name'),
  boundary: geometry('boundary').notNull(),
  iucnCategory: text('iucn_category'),
  countryCode: text('country_code'),
  designation: text('designation'),
  status: text('status'),
  rawPayload: jsonb('raw_payload'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcGfwAlerts = pgTable('src_gfw_alerts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  alertType: text('alert_type').notNull(),                 // 'GLAD' | 'RADD'
  location: geometry('location').notNull(),
  h3R6: h3Index('h3_r6'),
  detectedAt: timestamp('detected_at', { withTimezone: true }).notNull(),
  areaHa: real('area_ha'),
  confidenceLevel: text('confidence_level'),
  rawPayload: jsonb('raw_payload'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcLandmarkIlcLands = pgTable('src_landmark_ilc_lands', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  externalId: text('external_id'),
  countryCode: text('country_code'),
  recognitionStatus: text('recognition_status'),
  boundary: geometry('boundary').notNull(),
  rawPayload: jsonb('raw_payload'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcWorldclimLayers = pgTable('src_worldclim_layers', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  variable: text('variable').notNull(),                    // 'tmean' | 'prec' | etc.
  resolutionArcsec: integer('resolution_arcsec').notNull(),
  storagePath: text('storage_path').notNull(),             // Supabase Storage URI
  versionTag: text('version_tag'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcHumanFootprint = pgTable('src_human_footprint', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  referenceYear: integer('reference_year').notNull(),
  hfiRegion: geometry('hfi_region').notNull(),
  hfiScore: real('hfi_score'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})
```

- [ ] **Step 3: Update db/schema/index.ts**

Replace contents of `db/schema/index.ts`:

```ts
export * from './enums'
export * from './layer1-source'
```

- [ ] **Step 4: Generate migration via drizzle-kit**

```bash
pnpm run db:generate
```

Expected: `db/migrations/0001_*.sql` created with `CREATE TYPE` (enums) and `CREATE TABLE` for Layer 1 tables.

> **Note on custom types:** Drizzle Kit emits `geometry` and `h3index` as the dataType strings we set; PostGIS and h3 extensions provide the underlying types, so the SQL will execute correctly because Task 9 already enabled them.

- [ ] **Step 5: Apply migration**

```bash
pnpm run db:migrate
```

Expected: `apply 0001_*.sql`; `migrations complete`.

- [ ] **Step 6: Verify tables exist**

In Supabase SQL editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'src_%' OR table_name = 'species_id_map'
ORDER BY table_name;
```

Expected: `species_id_map`, `src_gbif_occurrences`, `src_gfw_alerts`, `src_human_footprint`, `src_iucn_assessments`, `src_iucn_ranges`, `src_landmark_ilc_lands`, `src_wdpa_areas`, `src_worldclim_layers`.

- [ ] **Step 7: Commit**

```bash
git add db/schema/enums.ts db/schema/layer1-source.ts db/schema/index.ts db/migrations/0001_*.sql
git commit -m "feat(db): Layer 1 schema — source cache tables and species_id_map"
```

---

## Task 11: Drizzle schema — Layer 2 (integration layer)

**Files:**
- Create: `db/schema/layer2-integration.ts`
- Modify: `db/schema/index.ts`

- [ ] **Step 1: Write Layer 2 schema**

Create `db/schema/layer2-integration.ts`:

```ts
import {
  pgTable, bigserial, integer, text, jsonb, timestamp, real, boolean, doublePrecision,
} from 'drizzle-orm/pg-core'
import {
  presenceTypeEnum, confidenceBandEnum, verificationTierEnum,
} from './enums'
import { geometry, h3Index } from './layer1-source'

export const speciesProfiles = pgTable('species_profiles', {
  id: integer('id').primaryKey(),                         // = canonical_species_id
  scientificName: text('scientific_name').notNull(),
  commonNames: jsonb('common_names'),                     // jsonb: { en: [], es: [], ... }
  taxonomicClass: text('taxonomic_class'),
  iucnStatus: text('iucn_status'),
  statusAssessmentDate: timestamp('status_assessment_date', { withTimezone: true }),
  populationTrend: text('population_trend'),
  integratedThreats: jsonb('integrated_threats'),
  keyGeographies: jsonb('key_geographies'),
  provenance: jsonb('provenance'),
  confidenceScore: real('confidence_score'),
  lastComputedAt: timestamp('last_computed_at', { withTimezone: true }).notNull().defaultNow(),
})

export const speciesLocationAssessments = pgTable('species_location_assessments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  speciesId: integer('species_id').notNull().references(() => speciesProfiles.id),
  h3Cell: h3Index('h3_cell').notNull(),
  // Integrated threat picture
  deforestationRate5yrPct: real('deforestation_rate_5yr_pct'),
  deforestationAlertCount12mo: integer('deforestation_alert_count_12mo'),
  hfiScore: real('hfi_score'),
  hfiDelta10yr: real('hfi_delta_10yr'),
  protectedAreaCoveragePct: real('protected_area_coverage_pct'),
  protectedAreaIucnCategories: jsonb('protected_area_iucn_categories'),
  climateExposureSsp245_2050: real('climate_exposure_ssp245_2050'),
  climateNicheLossPct: real('climate_niche_loss_pct'),
  miningConcessionOverlapPct: real('mining_concession_overlap_pct'),
  roadDensityDelta: real('road_density_delta'),
  // Integrated opportunity picture
  ilcOverlapPct: real('ilc_overlap_pct'),
  neighboringActiveProjects: integer('neighboring_active_projects'),
  localPractitionerCapacityScore: real('local_practitioner_capacity_score'),
  interventionEvidenceStrength: jsonb('intervention_evidence_strength'),
  // Honest uncertainty
  presenceType: presenceTypeEnum('presence_type').notNull(),
  surrogateEvidence: jsonb('surrogate_evidence'),
  confidenceScore: real('confidence_score'),
  confidenceBand: confidenceBandEnum('confidence_band'),
  dataGaps: text('data_gaps').array(),
  lastComputedAt: timestamp('last_computed_at', { withTimezone: true }).notNull().defaultNow(),
})

export const interventionOutcomes = pgTable('intervention_outcomes', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  contributorId: text('contributor_id'),                  // FK to users.id, but Layer 3 not yet defined; keep as text and add FK in a later migration
  speciesId: integer('species_id').references(() => speciesProfiles.id),
  location: geometry('location'),
  h3Cell: h3Index('h3_cell'),
  countryCode: text('country_code'),
  interventionType: text('intervention_type').notNull(),
  interventionSubtype: text('intervention_subtype'),
  durationMonths: integer('duration_months'),
  totalCostUsd: doublePrecision('total_cost_usd'),
  costBreakdown: jsonb('cost_breakdown'),
  outcomeMetrics: jsonb('outcome_metrics'),
  successRating: integer('success_rating'),               // 1–5; CHECK enforced in raw SQL post-migration
  narrative: text('narrative'),
  evidence: jsonb('evidence'),
  verificationTier: verificationTierEnum('verification_tier').notNull().default('auto'),
  verifiedBy: text('verified_by'),
  disclosedFunders: text('disclosed_funders').array(),
  conflictsOfInterest: text('conflicts_of_interest'),
  disputed: boolean('disputed').notNull().default(false),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
})

export const costPriors = pgTable('cost_priors', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  interventionType: text('intervention_type').notNull(),
  countryCode: text('country_code').notNull(),
  subRegion: text('sub_region'),
  costPerUnitMedian: doublePrecision('cost_per_unit_median').notNull(),
  costPerUnitP25: doublePrecision('cost_per_unit_p25'),
  costPerUnitP75: doublePrecision('cost_per_unit_p75'),
  unitDefinition: text('unit_definition').notNull(),       // e.g., "per km corridor"
  sampleSize: integer('sample_size'),
  evidenceStrength: real('evidence_strength'),
  costDrivers: jsonb('cost_drivers'),
  lastComputedAt: timestamp('last_computed_at', { withTimezone: true }).notNull().defaultNow(),
})

export const threatInterventionEvidence = pgTable('threat_intervention_evidence', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  threatType: text('threat_type').notNull(),
  interventionType: text('intervention_type').notNull(),
  effectivenessScore: real('effectiveness_score'),
  sampleSize: integer('sample_size'),
  contextModifiers: jsonb('context_modifiers'),
  literatureRefs: jsonb('literature_refs'),
})

export const stakeholderCapacity = pgTable('stakeholder_capacity', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  orgId: text('org_id'),                                   // optional FK to org_profiles, added later
  countryCode: text('country_code').notNull(),
  region: text('region'),
  interventionSpecialties: text('intervention_specialties').array(),
  historicalOutcomeScore: real('historical_outcome_score'),
  projectCount: integer('project_count').default(0),
  totalFundingManagedUsd: doublePrecision('total_funding_managed_usd').default(0),
  ilcAffiliated: boolean('ilc_affiliated').default(false),
  partnerVouched: boolean('partner_vouched').default(false),
  capacityScore: real('capacity_score'),
  lastComputedAt: timestamp('last_computed_at', { withTimezone: true }).notNull().defaultNow(),
})

export const regulatoryPathways = pgTable('regulatory_pathways', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  countryCode: text('country_code').notNull(),
  interventionType: text('intervention_type').notNull(),
  permitName: text('permit_name').notNull(),
  issuingAgency: text('issuing_agency'),
  typicalTimelineDays: integer('typical_timeline_days'),
  typicalCostUsd: doublePrecision('typical_cost_usd'),
  notes: text('notes'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const dataConfidenceScores = pgTable('data_confidence_scores', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  speciesId: integer('species_id').notNull().references(() => speciesProfiles.id),
  h3Cell: h3Index('h3_cell').notNull(),
  occurrenceDensity: real('occurrence_density'),
  recencyScore: real('recency_score'),
  sourceDiversity: real('source_diversity'),
  iucnFreshness: real('iucn_freshness'),
  spatialPrecision: real('spatial_precision'),
  compositeScore: real('composite_score').notNull(),
  band: confidenceBandEnum('band').notNull(),
  computedAt: timestamp('computed_at', { withTimezone: true }).notNull().defaultNow(),
})
```

- [ ] **Step 2: Re-export from index**

Edit `db/schema/index.ts`:

```ts
export * from './enums'
export * from './layer1-source'
export * from './layer2-integration'
```

- [ ] **Step 3: Generate and apply migration**

```bash
pnpm run db:generate
pnpm run db:migrate
```

Expected: a new `db/migrations/0002_*.sql` is created and applied.

- [ ] **Step 4: Verify tables**

In Supabase SQL editor:

```sql
SELECT count(*) FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN (
  'species_profiles','species_location_assessments','intervention_outcomes',
  'cost_priors','threat_intervention_evidence','stakeholder_capacity',
  'regulatory_pathways','data_confidence_scores'
);
```

Expected: 8.

- [ ] **Step 5: Commit**

```bash
git add db/schema/layer2-integration.ts db/schema/index.ts db/migrations/0002_*.sql
git commit -m "feat(db): Layer 2 schema — integration layer (species_profiles, location assessments, outcomes, cost priors, etc.)"
```

---

## Task 12: Drizzle schema — Layer 3 (platform & marketplace)

**Files:**
- Create: `db/schema/layer3-platform.ts`
- Create: `db/schema/ops.ts`
- Modify: `db/schema/index.ts`

- [ ] **Step 1: Write Layer 3 schema**

Create `db/schema/layer3-platform.ts`:

```ts
import {
  pgTable, bigserial, uuid, integer, text, jsonb, timestamp, real, boolean,
  doublePrecision, vector,
} from 'drizzle-orm/pg-core'
import {
  userRoleEnum, orgVerificationStatusEnum, projectStatusEnum,
  milestoneStatusEnum, fundingCommitmentStatusEnum, outcomeReportStatusEnum,
  verificationTierEnum, aiCapabilityEnum,
} from './enums'
import { geometry, h3Index } from './layer1-source'
import { speciesProfiles } from './layer2-integration'

// Users — id matches Supabase auth.users.id (uuid)
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),                            // = auth.users.id
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').notNull().default('other'),
  fullName: text('full_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const orgProfiles = pgTable('org_profiles', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  orgName: text('org_name').notNull(),
  orgType: text('org_type'),
  country: text('country'),
  website: text('website'),
  description: text('description'),
  verificationStatus: orgVerificationStatusEnum('verification_status')
    .notNull().default('unverified'),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  verifiedBy: uuid('verified_by').references(() => users.id),
})

export const projects = pgTable('projects', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  practitionerId: uuid('practitioner_id').notNull().references(() => users.id),
  speciesId: integer('species_id').references(() => speciesProfiles.id),
  location: geometry('location'),
  locationName: text('location_name'),
  countryCode: text('country_code'),
  h3Cell: h3Index('h3_cell'),
  status: projectStatusEnum('status').notNull().default('draft'),
  durationYears: integer('duration_years'),
  totalBudgetUsd: doublePrecision('total_budget_usd'),
  aiPlan: jsonb('ai_plan'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const projectInterventions = pgTable('project_interventions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  interventionType: text('intervention_type').notNull(),
  description: text('description'),
  budgetUsd: doublePrecision('budget_usd'),
  timelineMonths: integer('timeline_months'),
  ordering: integer('ordering').notNull().default(0),
})

export const projectMilestones = pgTable('project_milestones', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  status: milestoneStatusEnum('status').notNull().default('pending'),
  evidenceUrl: text('evidence_url'),
})

export const fundingCommitments = pgTable('funding_commitments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  funderId: uuid('funder_id').notNull().references(() => users.id),
  amountUsd: doublePrecision('amount_usd').notNull(),
  status: fundingCommitmentStatusEnum('status').notNull().default('pledged'),
  fiscalSponsorRef: text('fiscal_sponsor_ref'),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const fundingDisbursements = pgTable('funding_disbursements', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  commitmentId: integer('commitment_id').notNull().references(() => fundingCommitments.id),
  amountUsd: doublePrecision('amount_usd').notNull(),
  disbursedAt: timestamp('disbursed_at', { withTimezone: true }).notNull(),
  notes: text('notes'),
})

export const outcomeReports = pgTable('outcome_reports', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id),
  reportingPeriod: text('reporting_period'),               // e.g. '2026-Q4'
  populationChangePct: real('population_change_pct'),
  habitatChangeHa: doublePrecision('habitat_change_ha'),
  threatReductionScore: real('threat_reduction_score'),
  narrative: text('narrative'),
  evidenceUrls: text('evidence_urls').array(),
  verificationStatus: outcomeReportStatusEnum('verification_status')
    .notNull().default('submitted'),
  verifiedBy: uuid('verified_by').references(() => users.id),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
})

export const threatAlerts = pgTable('threat_alerts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  speciesId: integer('species_id').references(() => speciesProfiles.id),
  alertType: text('alert_type').notNull(),
  location: geometry('location').notNull(),
  h3Cell: h3Index('h3_cell'),
  severity: text('severity'),
  detectedAt: timestamp('detected_at', { withTimezone: true }).notNull(),
  draftResponsePlan: jsonb('draft_response_plan'),
  notifiedProjectIds: integer('notified_project_ids').array(),
})

export const fieldObservations = pgTable('field_observations', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  contributorId: uuid('contributor_id').notNull().references(() => users.id),
  speciesId: integer('species_id').references(() => speciesProfiles.id),
  location: geometry('location').notNull(),
  h3Cell: h3Index('h3_cell'),
  observedAt: timestamp('observed_at', { withTimezone: true }).notNull(),
  photoUrl: text('photo_url'),
  notes: text('notes'),
  verificationTier: verificationTierEnum('verification_tier').notNull().default('auto'),
  confidenceScore: real('confidence_score'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// AI layer
export const promptVersions = pgTable('prompt_versions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),                            // e.g. 'plan'
  version: text('version').notNull(),                      // semver
  template: text('template').notNull(),
  systemPrompt: text('system_prompt'),
  model: text('model').notNull(),
  temperature: real('temperature').notNull().default(0.2),
  gitCommit: text('git_commit'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: uuid('created_by').references(() => users.id),
})

export const aiOutputs = pgTable('ai_outputs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  capability: aiCapabilityEnum('capability').notNull(),
  projectId: integer('project_id').references(() => projects.id),
  userId: uuid('user_id').references(() => users.id),
  promptVersionId: integer('prompt_version_id').references(() => promptVersions.id),
  modelVersion: text('model_version'),
  temperature: real('temperature'),
  retrievalBundle: jsonb('retrieval_bundle'),
  rawOutput: jsonb('raw_output'),
  parsedOutput: jsonb('parsed_output'),
  validationPassed: boolean('validation_passed'),
  validationErrors: jsonb('validation_errors'),
  validationWarnings: jsonb('validation_warnings'),
  confidenceOverall: real('confidence_overall'),
  latencyMs: integer('latency_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// pgvector via drizzle-orm `vector` column type (imported above)
export const aiEmbeddings = pgTable('ai_embeddings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sourceType: text('source_type').notNull(),               // 'intervention_outcome' | 'species_profile' | 'project' | 'funder_intent'
  sourceId: integer('source_id').notNull(),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// User-side platform tables
export const funderIntentProfiles = pgTable('funder_intent_profiles', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  thematicPrefs: text('thematic_prefs').array(),
  regionPrefs: text('region_prefs').array(),
  budgetRangeMin: doublePrecision('budget_range_min'),
  budgetRangeMax: doublePrecision('budget_range_max'),
  givingHistory: jsonb('giving_history'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const funderShortlists = pgTable('funder_shortlists', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  funderId: uuid('funder_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  notes: text('notes'),
  addedAt: timestamp('added_at', { withTimezone: true }).notNull().defaultNow(),
})

export const userWatchlists = pgTable('user_watchlists', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  watchedH3Cells: text('watched_h3_cells').array(),        // h3 indices
  watchedSpeciesIds: integer('watched_species_ids').array(),
  notifyVia: text('notify_via').notNull().default('email'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const notifications = pgTable('notifications', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  payload: jsonb('payload'),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const adminActions = pgTable('admin_actions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  adminId: uuid('admin_id').notNull().references(() => users.id),
  targetTable: text('target_table').notNull(),
  targetId: text('target_id').notNull(),
  action: text('action').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

- [ ] **Step 2: Write ops schema**

Create `db/schema/ops.ts`:

```ts
import { pgTable, bigserial, integer, text, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { materializationStatusEnum } from './enums'

export const materializationJobs = pgTable('materialization_jobs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  jobType: text('job_type').notNull(),                     // e.g. 'species_location_assessments'
  source: text('source'),
  scope: jsonb('scope'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
  status: materializationStatusEnum('status').notNull().default('queued'),
  rowsProcessed: integer('rows_processed').default(0),
  rowsFailed: integer('rows_failed').default(0),
  errorLog: text('error_log'),
})

export const sourceRefreshLog = pgTable('source_refresh_log', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  source: text('source').notNull(),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
  nextDueAt: timestamp('next_due_at', { withTimezone: true }),
  recordsAdded: integer('records_added').default(0),
  recordsUpdated: integer('records_updated').default(0),
})
```

- [ ] **Step 3: Re-export from index**

Edit `db/schema/index.ts`:

```ts
export * from './enums'
export * from './layer1-source'
export * from './layer2-integration'
export * from './layer3-platform'
export * from './ops'
```

- [ ] **Step 4: Generate and apply migration**

```bash
pnpm run db:generate
pnpm run db:migrate
```

Expected: `db/migrations/0003_*.sql` created and applied.

- [ ] **Step 5: Verify all tables exist**

```sql
SELECT count(*) FROM information_schema.tables
WHERE table_schema = 'public';
```

Expected: at least 30 tables (sum of Layer 1, 2, 3 + ops + `_migrations`).

- [ ] **Step 6: Commit**

```bash
git add db/schema/layer3-platform.ts db/schema/ops.ts db/schema/index.ts db/migrations/0003_*.sql
git commit -m "feat(db): Layer 3 schema — users, projects, AI audit, marketplace, ops tables"
```

---

## Task 13: Migration — sync auth.users → public.users via trigger

When a user signs up via Supabase Auth, a row appears in `auth.users`. Our `public.users` table must mirror that row (with the `role` chosen at signup, written by the signup form). Best practice: a trigger on `auth.users` inserts a stub row in `public.users` so the FK is always valid; the role is updated by the signup form afterward.

**Files:**
- Create: `db/migrations/0100_users_sync_trigger.sql`

- [ ] **Step 1: Write the migration**

```sql
-- When a new user is created in auth.users, create a corresponding public.users row.
-- The signup form will UPDATE the role field shortly after.

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'other')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
```

- [ ] **Step 2: Apply**

```bash
pnpm run db:migrate
```

Expected: `apply 0100_users_sync_trigger.sql`.

- [ ] **Step 3: Verify trigger**

```sql
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

Expected: 1 row.

- [ ] **Step 4: Commit**

```bash
git add db/migrations/0100_users_sync_trigger.sql
git commit -m "feat(db): trigger to sync auth.users into public.users"
```

---

## Task 14: Migration — RLS policies for all tables

This is one large migration. RLS rules follow spec §3.4. We split into logical sections within the file for readability.

**Files:**
- Create: `db/migrations/9999_rls.sql`

- [ ] **Step 1: Write the RLS migration**

Create `db/migrations/9999_rls.sql`:

```sql
-- ============================================================================
-- Helper: check if current user is admin
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================================
-- Enable RLS on every table
-- ============================================================================
ALTER TABLE public.users                          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_profiles                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_interventions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_commitments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_disbursements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcome_reports                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_observations             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_alerts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_outputs                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_embeddings                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_versions                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funder_intent_profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funder_shortlists              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlists                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materialization_jobs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_refresh_log             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_location_assessments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_outcomes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_priors                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_intervention_evidence   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_capacity           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_pathways            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_confidence_scores         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_id_map                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_gbif_occurrences           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_iucn_assessments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_iucn_ranges                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_wdpa_areas                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_gfw_alerts                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_landmark_ilc_lands         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_worldclim_layers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_human_footprint            ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS
-- ============================================================================
CREATE POLICY users_self_read ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY users_self_update ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Inserts are done by the trigger as SECURITY DEFINER, no user-facing INSERT policy.

-- ============================================================================
-- ORG PROFILES
-- ============================================================================
CREATE POLICY org_profiles_public_verified_read ON public.org_profiles
  FOR SELECT USING (verification_status = 'verified' OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY org_profiles_self_write ON public.org_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY org_profiles_self_update ON public.org_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- PROJECTS
-- ============================================================================
CREATE POLICY projects_public_listed ON public.projects
  FOR SELECT USING (
    status IN ('listed','funded','closed')
    OR practitioner_id = auth.uid()
    OR public.is_admin()
  );
CREATE POLICY projects_owner_insert ON public.projects
  FOR INSERT WITH CHECK (practitioner_id = auth.uid());
CREATE POLICY projects_owner_update ON public.projects
  FOR UPDATE USING (practitioner_id = auth.uid()) WITH CHECK (practitioner_id = auth.uid());

-- ============================================================================
-- PROJECT INTERVENTIONS / MILESTONES — follow parent project
-- ============================================================================
CREATE POLICY pi_read ON public.project_interventions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
            AND (p.status IN ('listed','funded','closed')
                 OR p.practitioner_id = auth.uid()
                 OR public.is_admin()))
  );
CREATE POLICY pi_write ON public.project_interventions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
  );

CREATE POLICY pm_read ON public.project_milestones
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
            AND (p.status IN ('listed','funded','closed')
                 OR p.practitioner_id = auth.uid()
                 OR public.is_admin()))
  );
CREATE POLICY pm_write ON public.project_milestones
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
  );

-- ============================================================================
-- FUNDING COMMITMENTS / DISBURSEMENTS
-- ============================================================================
CREATE POLICY fc_read ON public.funding_commitments
  FOR SELECT USING (
    funder_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
    OR public.is_admin()
  );
CREATE POLICY fc_funder_insert ON public.funding_commitments
  FOR INSERT WITH CHECK (funder_id = auth.uid());

CREATE POLICY fd_read ON public.funding_disbursements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.funding_commitments fc
      WHERE fc.id = commitment_id
      AND (
        fc.funder_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = fc.project_id AND p.practitioner_id = auth.uid())
        OR public.is_admin()
      )
    )
  );
-- writes via service_role only; no user-facing write policy.

-- ============================================================================
-- OUTCOME REPORTS
-- ============================================================================
CREATE POLICY outcome_reports_read ON public.outcome_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.status = 'funded')
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
    OR public.is_admin()
  );
CREATE POLICY outcome_reports_write ON public.outcome_reports
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
  );

-- ============================================================================
-- FIELD OBSERVATIONS — public read; contributor write
-- ============================================================================
CREATE POLICY field_obs_read ON public.field_observations
  FOR SELECT USING (true);
CREATE POLICY field_obs_write ON public.field_observations
  FOR INSERT WITH CHECK (contributor_id = auth.uid());
CREATE POLICY field_obs_update ON public.field_observations
  FOR UPDATE USING (contributor_id = auth.uid()) WITH CHECK (contributor_id = auth.uid());

-- ============================================================================
-- AI OUTPUTS — self + project owner; writes via service_role only
-- ============================================================================
CREATE POLICY ai_outputs_read ON public.ai_outputs
  FOR SELECT USING (
    user_id = auth.uid()
    OR (project_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid()
    ))
    OR public.is_admin()
  );

-- ============================================================================
-- LAYER 2 (public read; service_role writes only)
-- ============================================================================
CREATE POLICY species_profiles_read ON public.species_profiles FOR SELECT USING (true);
CREATE POLICY sla_read ON public.species_location_assessments FOR SELECT USING (true);
CREATE POLICY io_read ON public.intervention_outcomes
  FOR SELECT USING (verification_tier IN ('peer','expert') OR contributor_id::uuid = auth.uid() OR public.is_admin());
CREATE POLICY io_self_write ON public.intervention_outcomes
  FOR INSERT WITH CHECK (contributor_id::uuid = auth.uid());
CREATE POLICY cp_read ON public.cost_priors FOR SELECT USING (true);
CREATE POLICY tie_read ON public.threat_intervention_evidence FOR SELECT USING (true);
CREATE POLICY sc_read ON public.stakeholder_capacity FOR SELECT USING (true);
CREATE POLICY rp_read ON public.regulatory_pathways FOR SELECT USING (true);
CREATE POLICY dcs_read ON public.data_confidence_scores FOR SELECT USING (true);
CREATE POLICY sim_read ON public.species_id_map FOR SELECT USING (true);

-- ============================================================================
-- THREAT ALERTS — public read
-- ============================================================================
CREATE POLICY threat_alerts_read ON public.threat_alerts FOR SELECT USING (true);

-- ============================================================================
-- AI EMBEDDINGS — public read
-- ============================================================================
CREATE POLICY ai_embeddings_read ON public.ai_embeddings FOR SELECT USING (true);

-- ============================================================================
-- LAYER 1 (service_role only — no user-facing policies)
-- ============================================================================
-- (RLS enabled, no policies = no anon/authenticated access; service_role bypasses RLS.)

-- ============================================================================
-- USER-SPECIFIC TABLES (self-only)
-- ============================================================================
CREATE POLICY fip_self ON public.funder_intent_profiles
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY fs_self ON public.funder_shortlists
  FOR ALL USING (funder_id = auth.uid()) WITH CHECK (funder_id = auth.uid());
CREATE POLICY uw_self ON public.user_watchlists
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY n_self ON public.notifications
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- ADMIN-ONLY
-- ============================================================================
CREATE POLICY admin_actions_admin_only ON public.admin_actions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY pv_admin_only ON public.prompt_versions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY mj_admin_only ON public.materialization_jobs
  FOR SELECT USING (public.is_admin());
CREATE POLICY srl_admin_only ON public.source_refresh_log
  FOR SELECT USING (public.is_admin());
```

- [ ] **Step 2: Apply migration**

```bash
pnpm run db:migrate
```

Expected: `apply 9999_rls.sql`.

- [ ] **Step 3: Verify RLS is enabled and policies are in place**

```sql
SELECT count(*) FROM pg_policies WHERE schemaname = 'public';
```

Expected: at least 30 policies.

```sql
SELECT count(*) FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
AND c.relkind = 'r'
AND c.relrowsecurity = true;
```

Expected: ≥ 35 (every table we enabled).

- [ ] **Step 4: Commit**

```bash
git add db/migrations/9999_rls.sql
git commit -m "feat(db): RLS policies for all tables"
```

---

## Task 15: Configure Supabase Auth providers (manual + verification)

This task is performed in the Supabase dashboard, not in code.

- [ ] **Step 1: Enable Email auth provider**

In Supabase Dashboard → **Authentication → Providers → Email**:
- Enabled: **on**
- Confirm email: **on** (recommended; for local dev you can leave off)
- Secure email change: **on**

- [ ] **Step 2: Enable Google OAuth**

In Supabase Dashboard → **Authentication → Providers → Google**:
- Enabled: **on**
- Set Client ID + Client Secret from a Google Cloud project (Console → APIs & Services → Credentials → Create OAuth 2.0 Client → "Web application")
- Authorized redirect URI to add in Google Cloud: `https://<your-ref>.supabase.co/auth/v1/callback`
- For local dev, also add: `http://localhost:3000`

- [ ] **Step 3: Set Site URL and Redirect URLs**

In Supabase Dashboard → **Authentication → URL Configuration**:
- Site URL: `http://localhost:3000` (will update to production URL on Vercel deploy)
- Redirect URLs allowlist: `http://localhost:3000/**`, and after Vercel deploy add the production URL.

- [ ] **Step 4: Verify by inviting a test email manually**

In Supabase Dashboard → **Authentication → Users → Add user → Send invite**: invite your own email. Expected: invite email arrives. (Mark as canceled if you don't want to consume it.)

This task has no commit. The next task wires up the client.

---

## Task 16: Supabase clients and middleware

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `middleware.ts` (root)

- [ ] **Step 1: Browser client**

Create `lib/supabase/client.ts`:

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
```

- [ ] **Step 2: Server client**

Create `lib/supabase/server.ts`:

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The setAll method was called from a Server Component — ignore;
            // the middleware will refresh the session.
          }
        },
      },
    },
  )
}
```

- [ ] **Step 3: Session-refresh middleware helper**

Create `lib/supabase/middleware.ts`:

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Touch the session so cookies refresh — required for SSR auth.
  await supabase.auth.getUser()

  return response
}
```

- [ ] **Step 4: Root middleware**

Create `middleware.ts`:

```ts
import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    // skip static, image, and API-internal paths
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
```

- [ ] **Step 5: Typecheck**

```bash
pnpm run typecheck
```

Expected: passes.

- [ ] **Step 6: Commit**

```bash
git add lib/supabase middleware.ts
git commit -m "feat(auth): Supabase SSR clients and session-refresh middleware"
```

---

## Task 17: Auth helpers — read role and require role

**Files:**
- Create: `lib/auth/role.ts`
- Create: `lib/auth/actions.ts`

- [ ] **Step 1: Write role helpers**

Create `lib/auth/role.ts`:

```ts
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'funder' | 'practitioner' | 'other' | 'admin'

export interface SessionUser {
  id: string
  email: string
  role: UserRole
  fullName: string | null
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: row } = await supabase
    .from('users')
    .select('id, email, role, full_name')
    .eq('id', user.id)
    .single()

  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    role: row.role as UserRole,
    fullName: row.full_name,
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  return user
}

export async function requireRole(allowed: UserRole[]): Promise<SessionUser> {
  const user = await requireUser()
  if (!allowed.includes(user.role)) redirect('/')
  return user
}
```

- [ ] **Step 2: Write sign-out server action**

Create `lib/auth/actions.ts`:

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

- [ ] **Step 3: Typecheck**

```bash
pnpm run typecheck
```

Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add lib/auth
git commit -m "feat(auth): role helpers and sign-out action"
```

---

## Task 18: OAuth callback route

**Files:**
- Create: `app/(auth)/callback/route.ts`

- [ ] **Step 1: Implement callback**

Create `app/(auth)/callback/route.ts`:

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }
  return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`)
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(auth\)/callback/route.ts
git commit -m "feat(auth): OAuth callback route"
```

---

## Task 19: Login page

**Files:**
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/login/actions.ts`

- [ ] **Step 1: Write login server action**

Create `app/(auth)/login/actions.ts`:

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function loginWithEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  redirect('/')
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin') ?? 'http://localhost:3000'
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/callback?next=/` },
  })
  if (error) return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  if (data?.url) redirect(data.url)
}
```

- [ ] **Step 2: Write login page**

Create `app/(auth)/login/page.tsx`:

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { loginWithEmail, loginWithGoogle } from './actions'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Log in to Ecotrax</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form action={loginWithEmail} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full">Log in</Button>
          </form>
          <form action={loginWithGoogle}>
            <Button type="submit" variant="outline" className="w-full">Continue with Google</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            New here? <Link href="/signup" className="underline">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
```

- [ ] **Step 3: Verify build passes**

```bash
pnpm run build
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
git add app/\(auth\)/login
git commit -m "feat(auth): login page with email + Google"
```

---

## Task 20: Signup page with role picker

**Files:**
- Create: `app/(auth)/signup/page.tsx`
- Create: `app/(auth)/signup/actions.ts`

- [ ] **Step 1: Write signup server action**

Create `app/(auth)/signup/actions.ts`:

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'

const ALLOWED_ROLES = ['funder', 'practitioner', 'other'] as const
type AllowedRole = (typeof ALLOWED_ROLES)[number]

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  role: z.enum(ALLOWED_ROLES),
})

export async function signupAction(formData: FormData) {
  const parsed = SignupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    role: formData.get('role'),
  })
  if (!parsed.success) {
    return redirect(`/signup?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? 'Invalid input')}`)
  }
  const { email, password, fullName, role } = parsed.data

  const supabase = await createClient()
  const origin = (await headers()).get('origin') ?? 'http://localhost:3000'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/callback?next=/`,
      data: { full_name: fullName, role },
    },
  })
  if (error) return redirect(`/signup?error=${encodeURIComponent(error.message)}`)

  // The auth.users → public.users trigger inserted a stub row. Update its role + name.
  if (data.user) {
    await supabase
      .from('users')
      .update({ role, full_name: fullName })
      .eq('id', data.user.id)
  }

  // If email confirmation is on, the user must confirm before logging in.
  redirect('/login?info=check_email')
}

export async function signupWithGoogleAction(formData: FormData) {
  const role = formData.get('role')
  const fullName = formData.get('fullName')
  const parsed = z.object({
    role: z.enum(ALLOWED_ROLES),
    fullName: z.string().min(1),
  }).safeParse({ role, fullName })
  if (!parsed.success) return redirect('/signup?error=role_required')

  const supabase = await createClient()
  const origin = (await headers()).get('origin') ?? 'http://localhost:3000'

  // Stash the role in the OAuth state via a query param on the callback URL.
  // After the trigger creates the public.users stub, the callback can update it.
  // For v1 we use a cookie set right before the redirect.
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/callback?next=/&pending_role=${parsed.data.role}&pending_name=${encodeURIComponent(parsed.data.fullName)}`,
    },
  })
  if (error) return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  if (data?.url) redirect(data.url)
}
```

- [ ] **Step 2: Update OAuth callback to apply pending role/name**

Edit `app/(auth)/callback/route.ts`:

```ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const pendingRole = searchParams.get('pending_role')
  const pendingName = searchParams.get('pending_name')

  if (!code) return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`)

  // Apply pending role/name if present (only on first signup via Google).
  if (data.user && (pendingRole || pendingName)) {
    const update: Record<string, string> = {}
    if (pendingRole) update.role = pendingRole
    if (pendingName) update.full_name = pendingName
    await supabase.from('users').update(update).eq('id', data.user.id)
  }
  return NextResponse.redirect(`${origin}${next}`)
}
```

- [ ] **Step 3: Write signup page with role picker**

Create `app/(auth)/signup/page.tsx`:

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select'
import { signupAction, signupWithGoogleAction } from './actions'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function SignupPage({ searchParams }: PageProps) {
  const { error } = await searchParams
  return (
    <main className="mx-auto flex min-h-dvh max-w-md items-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your Ecotrax account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <form action={signupAction} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required autoComplete="name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password (min 8 characters)</Label>
              <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role">I am a&hellip;</Label>
              <Select name="role" required>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funder">Funder (foundation, donor, ESG/CSR lead)</SelectItem>
                  <SelectItem value="practitioner">Practitioner (NGO, field biologist, project lead)</SelectItem>
                  <SelectItem value="other">Researcher, agency, ranger, or other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
```

- [ ] **Step 4: Build and dev-test**

```bash
pnpm run build
```

Expected: clean build.

```bash
pnpm run dev
```

Open `http://localhost:3000/signup` — page renders with role select. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add app/\(auth\)/signup app/\(auth\)/callback/route.ts
git commit -m "feat(auth): signup page with role picker (email + Google)"
```

---

## Task 21: Persona route group layouts and placeholder homes

**Files:**
- Create: `app/(funder)/layout.tsx`, `app/(funder)/marketplace/page.tsx`, `app/(funder)/portfolio/page.tsx`
- Create: `app/(practitioner)/layout.tsx`, `app/(practitioner)/projects/page.tsx`, `app/(practitioner)/outcomes/page.tsx`
- Create: `app/(generic)/layout.tsx`, `app/(generic)/explore/page.tsx`
- Create: `app/admin/layout.tsx`, `app/admin/page.tsx`
- Create: `app/(explore)/map/page.tsx`
- Create: `components/layout/header.tsx`, `components/layout/role-switcher.tsx`

- [ ] **Step 1: Header component**

Create `components/layout/header.tsx`:

```tsx
import Link from 'next/link'
import { getSessionUser } from '@/lib/auth/role'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/lib/auth/actions'
import { RoleSwitcher } from './role-switcher'

export async function Header() {
  const user = await getSessionUser()
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">Ecotrax</Link>
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <RoleSwitcher currentRole={user.role} />
              <span className="text-muted-foreground">{user.email}</span>
              <form action={signOutAction}>
                <Button type="submit" variant="ghost" size="sm">Sign out</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link href="/signup"><Button size="sm">Sign up</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Role switcher**

Create `components/layout/role-switcher.tsx`:

```tsx
'use client'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { UserRole } from '@/lib/auth/role'
import { switchRoleAction } from '@/lib/auth/actions-role'

const LABELS: Record<UserRole, string> = {
  funder: 'Funder',
  practitioner: 'Practitioner',
  other: 'Researcher / other',
  admin: 'Admin',
}

export function RoleSwitcher({ currentRole }: { currentRole: UserRole }) {
  const router = useRouter()

  async function setRole(role: UserRole) {
    await switchRoleAction(role)
    router.refresh()
    router.push(role === 'funder' ? '/marketplace' : role === 'practitioner' ? '/projects' : '/explore')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">{LABELS[currentRole]}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(['funder', 'practitioner', 'other'] as UserRole[]).map((r) => (
          <DropdownMenuItem key={r} onClick={() => setRole(r)}>{LABELS[r]}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 3: Role-switch server action**

Create `lib/auth/actions-role.ts`:

```ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { UserRole } from './role'
import { z } from 'zod'

const SwitchRoleSchema = z.enum(['funder', 'practitioner', 'other'])

export async function switchRoleAction(role: UserRole) {
  const parsed = SwitchRoleSchema.safeParse(role)
  if (!parsed.success) return { ok: false, error: 'invalid role' }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'unauthenticated' }
  await supabase.from('users').update({ role: parsed.data }).eq('id', user.id)
  return { ok: true }
}
```

> **Note:** Admin is NOT a switchable role. Admin can be assigned only via the SQL script in Task 25.

- [ ] **Step 4: Funder layout + placeholder pages**

Create `app/(funder)/layout.tsx`:

```tsx
import { requireRole } from '@/lib/auth/role'
import { Header } from '@/components/layout/header'
import Link from 'next/link'

export default async function FunderLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['funder', 'admin'])
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="w-48 shrink-0 text-sm">
          <p className="mb-2 font-semibold">Funder</p>
          <ul className="space-y-1">
            <li><Link href="/marketplace" className="hover:underline">Marketplace</Link></li>
            <li><Link href="/portfolio" className="hover:underline">Portfolio</Link></li>
          </ul>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </>
  )
}
```

Create `app/(funder)/marketplace/page.tsx`:

```tsx
export default function MarketplacePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Marketplace</h1>
      <p className="mt-2 text-muted-foreground">Project browsing arrives in Plan 6.</p>
    </div>
  )
}
```

Create `app/(funder)/portfolio/page.tsx`:

```tsx
export default function PortfolioPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Your portfolio</h1>
      <p className="mt-2 text-muted-foreground">Funded projects appear here once funding flows are live in Plan 6.</p>
    </div>
  )
}
```

- [ ] **Step 5: Practitioner layout + placeholder pages**

Create `app/(practitioner)/layout.tsx`:

```tsx
import { requireRole } from '@/lib/auth/role'
import { Header } from '@/components/layout/header'
import Link from 'next/link'

export default async function PractitionerLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['practitioner', 'admin'])
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="w-48 shrink-0 text-sm">
          <p className="mb-2 font-semibold">Practitioner</p>
          <ul className="space-y-1">
            <li><Link href="/projects" className="hover:underline">My projects</Link></li>
            <li><Link href="/outcomes" className="hover:underline">Outcomes</Link></li>
          </ul>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </>
  )
}
```

Create `app/(practitioner)/projects/page.tsx`:

```tsx
export default function MyProjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">My projects</h1>
      <p className="mt-2 text-muted-foreground">Project Builder ships in Plan 5.</p>
    </div>
  )
}
```

Create `app/(practitioner)/outcomes/page.tsx`:

```tsx
export default function OutcomesPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Outcomes</h1>
      <p className="mt-2 text-muted-foreground">Outcome reporting ships in Plan 5.</p>
    </div>
  )
}
```

- [ ] **Step 6: Generic and explore layouts/pages**

Create `app/(generic)/layout.tsx`:

```tsx
import { requireUser } from '@/lib/auth/role'
import { Header } from '@/components/layout/header'

export default async function GenericLayout({ children }: { children: React.ReactNode }) {
  await requireUser()
  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </>
  )
}
```

Create `app/(generic)/explore/page.tsx`:

```tsx
export default function ExplorePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Explore</h1>
      <p className="mt-2 text-muted-foreground">Q&amp;A over species and locations ships in Plan 4.</p>
    </div>
  )
}
```

Create `app/(explore)/map/page.tsx`:

```tsx
import { Header } from '@/components/layout/header'

export default function MapPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold">Global map</h1>
        <p className="mt-2 text-muted-foreground">Map visualization ships in Plan 5.</p>
      </main>
    </>
  )
}
```

- [ ] **Step 7: Admin layout + placeholder home**

Create `app/admin/layout.tsx`:

```tsx
import { requireRole } from '@/lib/auth/role'
import { Header } from '@/components/layout/header'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['admin'])
  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </>
  )
}
```

Create `app/admin/page.tsx`:

```tsx
export default function AdminHome() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin console</h1>
      <p className="mt-2 text-muted-foreground">Moderation queues ship in Plan 7.</p>
    </div>
  )
}
```

- [ ] **Step 8: Update marketing landing page with persona-aware redirect**

Replace contents of `app/page.tsx`:

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { getSessionUser } from '@/lib/auth/role'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const user = await getSessionUser()
  if (user) {
    if (user.role === 'funder') redirect('/marketplace')
    if (user.role === 'practitioner') redirect('/projects')
    if (user.role === 'admin') redirect('/admin')
    redirect('/explore')
  }
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-semibold leading-tight">
          Conservation funding, directed by evidence.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          GBIF tells you where the species is. Ecotrax tells you what to do, what
          it costs, who can do it, and whether it worked.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/signup"><Button size="lg">Get started</Button></Link>
          <Link href="/marketplace"><Button size="lg" variant="outline">Browse the marketplace</Button></Link>
        </div>
      </main>
    </>
  )
}
```

> **Note:** the landing redirects funders to `/marketplace`. Because the funder layout is gated, that page renders only for funders/admins; the public marketplace browse view from spec §6.3 ships in Plan 6 — for v1 foundation, the gated placeholder is sufficient.

- [ ] **Step 9: Build**

```bash
pnpm run build
```

Expected: clean build. If a route conflict appears between `(funder)/marketplace` and a public `/marketplace`, that's expected — the public marketplace ships in Plan 6.

- [ ] **Step 10: Manual smoke test**

```bash
pnpm run dev
```

- Visit `/` → marketing page with Get Started + Browse buttons
- Visit `/signup` → role picker form
- Sign up as practitioner → redirect to `/projects` (placeholder visible)
- Sign out → back to marketing
- Sign up another account as funder → redirect to `/marketplace` (placeholder visible)
- Sign out

Stop the server.

- [ ] **Step 11: Commit**

```bash
git add app components/layout lib/auth/actions-role.ts
git commit -m "feat: persona route shells (funder, practitioner, generic, admin) with header and role switcher"
```

---

## Task 22: Admin promotion script

**Files:**
- Create: `scripts/promote-admin.sql`
- Modify: `README.md` (add promotion instructions)

- [ ] **Step 1: Write SQL script**

Create `scripts/promote-admin.sql`:

```sql
-- Promote a user to admin role.
-- Run in Supabase SQL editor or via psql. Replace <email> with the target.

UPDATE public.users
SET role = 'admin'
WHERE email = '<email>';

-- Verify
SELECT id, email, role FROM public.users WHERE email = '<email>';
```

- [ ] **Step 2: Commit (README update happens in Task 25)**

```bash
git add scripts/promote-admin.sql
git commit -m "chore: admin promotion SQL script"
```

---

## Task 23: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    name: Typecheck, lint, test, build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - run: pnpm run typecheck

      - run: pnpm run lint

      - run: pnpm run test

      - name: Build
        env:
          NEXT_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
          NEXT_PUBLIC_SUPABASE_ANON_KEY: placeholder
          DATABASE_URL: postgresql://placeholder
        run: pnpm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "chore: GitHub Actions CI (typecheck, lint, test, build)"
```

---

## Task 24: Push to GitHub

This is a one-time setup task that the user performs.

- [ ] **Step 1: Create empty GitHub repo**

User action: visit `https://github.com/new`. Create a new repository named `ecotrax`. **Do not** add README, license, or .gitignore — keep the repo empty.

- [ ] **Step 2: Add remote and push**

```bash
git remote add origin git@github.com:<your-username>/ecotrax.git
git push -u origin main
```

Expected: push succeeds; `https://github.com/<your-username>/ecotrax/actions` shows the CI workflow running.

- [ ] **Step 3: Verify CI passes**

Wait ~2 minutes; the Actions tab should show a green check on the `validate` job.

If lint or typecheck fail, fix locally, commit, and push.

> No commit step here — the push itself is the artifact.

---

## Task 25: Vercel deploy and README

**Files:**
- Create: `vercel.json`
- Create: `README.md`

- [ ] **Step 1: vercel.json**

Create `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install --frozen-lockfile",
  "regions": ["iad1"]
}
```

- [ ] **Step 2: README**

Create `README.md`:

````markdown
# Ecotrax

Conservation intelligence platform. See `docs/superpowers/specs/2026-05-03-ecotrax-mvp-design.md` for the design spec and `docs/superpowers/plans/README.md` for the phased implementation plan.

## Stack

Next.js 15 (App Router) · Supabase (PostgreSQL + PostGIS + pgvector + pg_cron + h3) · Drizzle ORM · Tailwind v4 + shadcn/ui · Vitest · GitHub Actions · Vercel.

## Local setup

### Prerequisites

- Node 20+, pnpm 9+
- A Supabase project (free tier is fine)
- (Optional now) Anthropic, OpenAI, IUCN, GFW, Resend keys (used in later plans)

### First-time setup

```bash
cp .env.example .env.local
# fill in:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY
#   DATABASE_URL  (Settings → Database → Connection string → URI)

pnpm install
pnpm run db:migrate
pnpm run dev
```

App is at `http://localhost:3000`.

### Enable Supabase Auth providers

In the Supabase dashboard:
- **Authentication → Providers → Email**: enable
- **Authentication → Providers → Google**: enable, set client ID/secret from Google Cloud Console
- **Authentication → URL Configuration**: Site URL `http://localhost:3000`, allow `http://localhost:3000/**` and your Vercel URL once deployed

### Promote a user to admin

After signing up at `/signup`, run `scripts/promote-admin.sql` against the database (Supabase SQL Editor or `psql`) — replace `<email>` with the user's email.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run Vitest |
| `pnpm typecheck` | TypeScript check (no emit) |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Drizzle Kit: generate migrations from schema |
| `pnpm db:migrate` | Apply all `db/migrations/*.sql` in order |
| `pnpm db:studio` | Drizzle Studio (DB browser) |

## Deploying to Vercel

1. Push to GitHub (see `git remote add origin …` in setup history).
2. At `vercel.com/new`, import the GitHub repo.
3. Set environment variables (copy `.env.example` keys; use real values for prod).
4. Update Supabase **Authentication → URL Configuration** to add the Vercel URL.

## Project layout

```
app/                 Next.js App Router routes (persona-grouped)
components/          Reusable UI; shadcn primitives + trust-UX components
db/                  Drizzle schema, SQL migrations, migration runner
lib/                 Supabase clients, auth helpers, utils
docs/superpowers/    Spec and implementation plans
```

## Where to look next

After Plan 1 ships, work proceeds plan-by-plan. See `docs/superpowers/plans/README.md` for the phase list and `docs/superpowers/plans/<file>` for each plan's tasks.
````

- [ ] **Step 3: Commit**

```bash
git add vercel.json README.md
git commit -m "docs: README with setup, scripts, and deploy guide; add vercel.json"
```

- [ ] **Step 4: Push**

```bash
git push
```

Expected: CI passes again.

- [ ] **Step 5: Connect Vercel (user action)**

User action:
1. Visit `https://vercel.com/new`, import `ecotrax` from GitHub.
2. Vercel auto-detects Next.js. Confirm build command (`pnpm run build`) and install command (`pnpm install --frozen-lockfile`).
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`). Do not add `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`/`IUCN_API_TOKEN`/`GFW_API_KEY`/`RESEND_API_KEY` yet — they're for later plans.
4. Click **Deploy**. Wait ~2 minutes.
5. Once deployed, copy the production URL.
6. In Supabase **Authentication → URL Configuration**, set **Site URL** to the Vercel production URL and add `https://<vercel-url>/**` to the Redirect allow-list.
7. Visit the production URL — landing page should render.

> No commit step. The Vercel project URL itself is the artifact.

---

## Acceptance Test (final verification of Plan 1)

After Task 25, run through this checklist live (some local, some on the Vercel URL).

- [ ] **A. Migrations**
  - In Supabase Studio, open the `public` schema. Verify all tables from spec §3 are present (≥ 30).
  - Run `SELECT COUNT(*) FROM pg_policies WHERE schemaname='public';` → ≥ 30.
  - Run `SELECT COUNT(*) FROM pg_extension WHERE extname IN ('postgis','vector','pg_cron','h3','h3_postgis','pg_trgm','uuid-ossp');` → 7.

- [ ] **B. Auth + role picker (production URL)**
  - Sign up a fresh email as `practitioner`. Confirm email if confirmation is on. Log in.
  - Land on `/projects` placeholder.
  - Sign out. Sign up another email as `funder`. Land on `/marketplace` placeholder.
  - Try to visit `/projects` while logged in as funder → redirect to `/`.

- [ ] **C. Admin promotion**
  - Run `scripts/promote-admin.sql` against the Supabase DB with one of your test emails.
  - Log out, log back in. Visit `/admin` → admin home renders. Visit `/marketplace` and `/projects` — both render (admin can see all persona routes).

- [ ] **D. Trust UX components**
  - `pnpm test` → all passing.

- [ ] **E. CI**
  - On `https://github.com/<user>/ecotrax/actions`, latest workflow on `main` is green.

- [ ] **F. Trigger**
  - In Supabase SQL Editor: `SELECT id, email, role FROM public.users;`. Each test signup appears with the expected role.

When all six pass, Plan 1 is complete and Plan 2 can begin.

---

## Self-Review

**Spec coverage (§ → plan tasks):**
- §2 stack → Tasks 2–6, 8
- §3.1 Layer 1 → Task 10
- §3.2 Layer 2 → Task 11
- §3.3 Layer 3 → Task 12
- §3.4 RLS → Task 14
- §6.1 routes → Task 21
- §6.2 auth → Tasks 15–20
- §6.3 org-profile gate → deferred to Plans 5–6 (gate UI happens at first listing/funding action)
- §6.4 state mgmt → libraries installed (Task 3); usage in later plans
- §6.5 maps → deferred to Plan 5 (placeholder route in Task 21)
- §6.6 trust UX → Task 7
- §6.7 component library → Task 5

**Placeholder scan:** all `<email>`/`<your-username>`/`<your-ref>` placeholders are user-fill spots in env files and SQL scripts, clearly marked with comments. No "TBD" or "implement later" left in code/migrations.

**Type consistency:** schema field names match between Drizzle TS (camelCase) and SQL (snake_case via Drizzle's column-name convention). RLS policy column references use snake_case as expected by Postgres. Enum values in `db/schema/enums.ts` match strings used in spec §3.3.

**Note for executor:** The OAuth `pending_role` flow in Task 20 uses URL params for v1 simplicity. If you find that Google revokes the redirect URL with extra params, fall back to a temporary cookie set in `signupWithGoogleAction` and read in the callback.
