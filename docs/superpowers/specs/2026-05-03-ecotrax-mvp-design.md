# Ecotrax MVP — Design Spec

**Date:** 2026-05-03
**Status:** Draft for user review
**Source PRD:** `Ecotrax_PRD.md` (v1.0, May 2026)

---

## 1. Overview

Ecotrax is the conservation intelligence platform described in the PRD: an integrated data layer + AI-generated, costed intervention plans + a donor-practitioner exchange with public outcome tracking. This spec defines the v1 MVP — a vertical slice that touches all 10 PRD pillars thinly while building real, integrated infrastructure (no mocks).

### 1.1 Build approach: vertical slice

We build one complete user journey end-to-end before widening:

> **Practitioner creates a project (with AI-generated, costed intervention plan over real GBIF/IUCN/GFW/WDPA data) → Funder discovers it on the marketplace → Funder pledges → Admin confirms → Practitioner reports outcomes.**

Every pillar of the PRD gets a thin wire through it. Once the slice ships, we widen by depth (more capabilities per pillar) and breadth (additional personas, taxa, regions).

### 1.2 What this MVP is NOT

- Not a viewer of source data (GBIF/IUCN/GFW already do that). The product is the **integration layer** — Layer 2 below.
- Not a payments processor (v1 routes pledges through a fiscal sponsor; on-platform money movement deferred).
- Not multilingual (English only at v1).
- Not native mobile / offline (responsive web only).
- Not the scenario modeler, shadow IUCN assessments, or grant document drafting (deferred).

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router), React Server Components, Tailwind, shadcn/ui |
| Hosting | Vercel |
| Database | Supabase PostgreSQL with extensions: `postgis`, `vector` (pgvector), `pg_cron`, `h3-pg` |
| Auth | Supabase Auth (email + Google OAuth) |
| Storage | Supabase Storage (media, evidence, vector tiles) |
| Realtime | Supabase Realtime |
| ORM | Drizzle ORM |
| AI / LLM | Anthropic Claude via `@anthropic-ai/sdk` + Vercel AI SDK for streaming |
| Embeddings | OpenAI `text-embedding-3-small` (1536-dim) |
| Maps | MapLibre GL JS via `react-map-gl`; OpenMapTiles base; vector tiles for ranges/PAs in Supabase Storage |
| Bulk ETL runtime | GitHub Actions (free tier; switch to Fly.io worker once paying customers) |
| Short-cycle ETL | Vercel Cron + API routes |
| In-DB ETL | Supabase `pg_cron` |
| Email | Resend (transactional only) |

No Python/FastAPI. All AI, ETL orchestration, and data work runs in TypeScript via Node on Vercel + GitHub Actions.

---

## 3. Schema

The schema has three layers. **Layer 1** is commodity source cache; users never query it directly. **Layer 2** is the integration layer — the actual product. **Layer 3** is the marketplace and platform tables.

### 3.1 Layer 1 — Source Cache

ETL targets, refreshed per-source SLA, used only as inputs to Layer 2 derivations.

```
src_gbif_occurrences      raw GBIF occurrence records, h3-indexed at res 5/6/7
src_iucn_assessments      raw IUCN Red List assessments
src_iucn_ranges           raw IUCN range polygons
src_wdpa_areas            raw protected-area polygons (WDPA)
src_gfw_alerts            raw GLAD/RADD deforestation alerts
src_landmark_ilc_lands    raw indigenous/community land polygons
src_worldclim_layers      climate raster references
src_humanfootprint        HFI rasters/polygons
src_ebird_observations    optional, same shape as GBIF
src_obis_occurrences      optional marine, same shape as GBIF
```

Plus the reconciliation table:
```
species_id_map
  canonical_species_id, source_system, source_id (text),
  match_method (exact|synonym|fuzzy|manual),
  match_confidence (0-1), manual_override (bool),
  reconciled_at
```

### 3.2 Layer 2 — Integration (the product)

Derived from Layer 1 by ETL jobs. Every column is either a source-aggregated metric or a multi-source synthesis. Every row carries provenance + confidence.

```
species_profiles
  id (canonical_species_id), scientific_name, common_names (jsonb),
  taxonomic_class, iucn_status, status_assessment_date,
  population_trend,
  integrated_threats (jsonb)        -- fused IUCN narrative + GFW pressure
                                       + HFI delta + climate exposure
  key_geographies (jsonb)           -- top countries/regions by priority score
  provenance (jsonb)                -- per-field source set
  confidence_score, last_computed_at

species_location_assessments        -- THE LOAD-BEARING TABLE
  id, species_id, h3_cell (resolution 5–7),
  -- integrated threat picture
  deforestation_rate_5yr_pct, deforestation_alert_count_12mo,
  hfi_score, hfi_delta_10yr,
  protected_area_coverage_pct, protected_area_iucn_categories (jsonb),
  climate_exposure_ssp245_2050, climate_niche_loss_pct,
  mining_concession_overlap_pct, road_density_delta,
  -- integrated opportunity picture
  ilc_overlap_pct, neighboring_active_projects (int),
  local_practitioner_capacity_score,
  intervention_evidence_strength (jsonb),
  -- honest uncertainty
  presence_type (observed|inferred_high|inferred_med|inferred_low),
  surrogate_evidence (jsonb),       -- when inferred: proxies + weights
  confidence_score, confidence_band,
  data_gaps (text[]),
  last_computed_at

intervention_outcomes              -- the novel corpus (no other platform has this)
  id, contributor_id, species_id,
  location (geometry + h3_cell), country_code,
  intervention_type, intervention_subtype,
  duration_months, total_cost_usd, cost_breakdown (jsonb),
  outcome_metrics (jsonb),          -- population, habitat, threat reduction
  success_rating (1-5), narrative,
  evidence (jsonb),                 -- photos, docs, peer references
  verification_tier (auto|peer|expert), verified_by,
  disclosed_funders (text[]), conflicts_of_interest (text),
  disputed (bool), submitted_at

cost_priors                        -- regionalized empirical cost models
  id, intervention_type, country_code, sub_region,
  cost_per_unit_median, cost_per_unit_p25, cost_per_unit_p75,
  unit_definition,                  -- "per km corridor", "per ranger-month"
  sample_size, evidence_strength,
  cost_drivers (jsonb), last_computed_at

threat_intervention_evidence       -- threat → intervention with evidence strength
  id, threat_type, intervention_type,
  effectiveness_score, sample_size,
  context_modifiers (jsonb),
  literature_refs (jsonb)

stakeholder_capacity               -- not just a directory; capacity-scored
  id, org_id, country_code, region,
  intervention_specialties (text[]),
  historical_outcome_score, project_count, total_funding_managed_usd,
  ilc_affiliated (bool), partner_vouched (bool),
  capacity_score, last_computed_at

regulatory_pathways                -- (country, intervention) → permits + timelines
  id, country_code, intervention_type, permit_name, issuing_agency,
  typical_timeline_days, typical_cost_usd, notes, updated_at

data_confidence_scores             -- cross-cutting, per (species, h3_cell)
  id, species_id, h3_cell,
  occurrence_density, recency_score, source_diversity,
  iucn_freshness, spatial_precision,
  composite_score (0-100), band, computed_at
```

### 3.3 Layer 3 — Marketplace, Platform, AI

```
users
  id, email, role (funder|practitioner|other|admin),
  full_name, created_at

org_profiles
  id, user_id, org_name, org_type, country, website, description,
  verification_status (unverified|verified|rejected),
  verified_at, verified_by

projects
  id, practitioner_id, species_id,
  location (geometry point), location_name, country_code, h3_cell,
  status (draft|submitted|listed|funded|closed),
  duration_years, total_budget_usd,
  ai_plan (jsonb),                  -- structured plan from §4.3
  created_at, updated_at

project_interventions
  id, project_id, intervention_type, description,
  budget_usd, timeline_months, ordering

project_milestones
  id, project_id, title, due_date,
  status (pending|completed), evidence_url

funding_commitments
  id, project_id, funder_id, amount_usd,
  status (pledged|confirmed|disbursed),
  fiscal_sponsor_ref, message, created_at

funding_disbursements
  id, commitment_id, amount_usd, disbursed_at, notes

outcome_reports
  id, project_id, reporting_period,
  population_change_pct, habitat_change_ha,
  threat_reduction_score, narrative,
  evidence_urls (text[]),
  verification_status (submitted|verified|disputed),
  verified_by, submitted_at

threat_alerts
  id, species_id, alert_type, location (geometry polygon), h3_cell,
  severity, detected_at, draft_response_plan (jsonb),
  notified_project_ids (int[])

field_observations
  id, contributor_id, species_id,
  location (geometry point), h3_cell,
  observed_at, photo_url, notes,
  verification_tier (auto|peer|expert),
  confidence_score, created_at

ai_outputs                         -- audit trail
  id, capability (plan|qa|match), project_id, user_id,
  prompt_version_id, model_version, temperature,
  retrieval_bundle (jsonb), raw_output (jsonb), parsed_output (jsonb),
  validation_passed, validation_errors (jsonb),
  validation_warnings (jsonb),     -- soft-warn mode (§4)
  confidence_overall, latency_ms, created_at

ai_embeddings                      -- pgvector
  id, source_type (intervention_outcome|species_profile|project|funder_intent),
  source_id, content (text), embedding (vector 1536), created_at

prompt_versions
  id, name, version (semver), template, system_prompt,
  model, temperature, git_commit, created_at, created_by

funder_intent_profiles
  id, user_id, thematic_prefs (text[]), region_prefs (text[]),
  budget_range_min, budget_range_max, giving_history (jsonb),
  updated_at

funder_shortlists
  id, funder_id, project_id, notes, added_at

user_watchlists
  id, user_id, watched_h3_cells (h3 index[]),
  watched_species_ids (int[]),
  notify_via (email|in_app), created_at

notifications
  id, user_id, type, payload (jsonb), read_at, created_at

admin_actions                      -- moderation audit log
  id, admin_id, target_table, target_id, action,
  notes, created_at

materialization_jobs               -- ETL job tracking
  id, job_type, source, scope (jsonb),
  started_at, finished_at, status,
  rows_processed, rows_failed, error_log

source_refresh_log
  id, source, last_synced_at, next_due_at,
  records_added, records_updated
```

### 3.4 Row-Level Security

RLS on for every table.

| Table | Read | Write |
|---|---|---|
| `users` | self only (public columns via view) | self only |
| `org_profiles` | public if verified; else self | self only |
| `projects` (listed/funded) | public | owner only |
| `projects` (draft/submitted) | owner + admin | owner only |
| `project_interventions`, `project_milestones` | follows parent project | parent project owner |
| `funding_commitments` | funder = self; practitioner = own projects'; admin all | funder = self only |
| `funding_disbursements` | follows parent commitment | service_role (admin-managed) |
| `outcome_reports` | public if project funded; else owner | project practitioner |
| `field_observations` | public read | contributor only |
| Layer 1 (`src_*`) | service_role only | service_role only |
| Layer 2 (`species_*`, `intervention_outcomes`, `cost_priors`, etc.) | public read | service_role only (peer-verified intervention_outcomes also writable by contributor) |
| `ai_outputs` | self + project owner; admin all | service_role only |
| `prompt_versions`, `materialization_jobs`, `source_refresh_log` | admin only | service_role only |
| `admin_actions` | admin only | admin only |
| `notifications`, `user_watchlists`, `funder_intent_profiles`, `funder_shortlists` | self only | self only |
| `threat_alerts` | public read | service_role only |
| `ai_embeddings`, `data_confidence_scores`, `species_id_map` | public read | service_role only |

ETL jobs run as `service_role` server-side; user-facing reads/writes go through `anon` + RLS.

---

## 4. AI Layer

### 4.1 v1 capabilities

1. **Intervention plan generation** — for the practitioner project builder
2. **Project ↔ funder matching** — embedding similarity over project profile vs funder intent profile, plus thematic / geographic / budget filters
3. **Natural-language species/location Q&A** — entry-point UX over Layer 2 data

Deferred: shadow IUCN assessments, document drafting, threat-alert response plans, multilingual generation.

### 4.2 RAG retrieval bundle (intervention plan)

```
retrieval = {
  species_profile         (1 row from species_profiles)
  location_assessment     (1 row from species_location_assessments for h3_cell)
  similar_outcomes        (top 5–10 from intervention_outcomes via pgvector +
                           same threat type + same region tier)
  threat_evidence         (rows from threat_intervention_evidence per threat)
  cost_priors             (rows for country + candidate intervention types)
  regulatory_pathway      (rows for country + candidate interventions)
  stakeholders            (top 10 from stakeholder_capacity for region)
  recent_alerts           (threat_alerts in cell, last 90 days)
}
```

Each item has a stable `source_id` (e.g., `intervention_outcomes:1234`). System prompt forbids parametric claims; missing info → `data_gaps`.

### 4.3 Output schema

```json
{
  "executive_summary": { "text": "...", "citations": [...] },
  "threat_analysis": [
    { "threat": "...", "severity": "...", "evidence": [...], "confidence": 0-100 }
  ],
  "recommended_interventions": [
    {
      "type": "...", "description": "...",
      "rationale_citations": [...],
      "duration_months": 0,
      "budget_breakdown": [
        { "line": "...", "amount_usd": 0, "cost_basis": "cost_priors:..." }
      ],
      "expected_outcomes": [
        { "metric": "...", "projection": "...", "confidence": 0-100,
          "analog_basis": "intervention_outcomes:..." }
      ]
    }
  ],
  "total_budget_usd": 0,
  "regulatory_pathway": { "permits": [...], "stakeholders": [...] },
  "data_gaps": ["..."],
  "confidence_overall": 0-100
}
```

### 4.4 Validator (server-side, runs on every output)

- Every citation ID must exist in `retrieval_bundle`
- `total_budget_usd` must equal sum of line items
- Every `budget_breakdown.cost_basis` references a real `cost_priors` ID or is flagged `manual_estimate`
- Schema-shape validated via Zod

**Soft-warn mode:** validation failures do not block return. The output is persisted with `validation_warnings` populated; the UI surfaces warnings inline. One auto-retry with a stricter prompt happens before returning the warned output.

### 4.5 Server-derived confidence

```
confidence_overall = weighted_avg(
  retrieval_coverage,         // # of 8 retrieval slots populated
  spatial_confidence,         // species_location_assessments.confidence_score
  source_freshness,           // median days-since-update
  citation_density,           // citations per claim
  outcomes_sample_size        // n of similar intervention_outcomes
)
```

Banded for display: Low / Moderate / High / Very High. Capped at 50 if retrieval bundle has <3 categories populated; `data_gaps` mandatory non-empty in that case.

### 4.6 Audit & versioning

Every output reproducible from `prompt_version_id` + `retrieval_bundle` + `model_version` + `temperature`. Prompts are git-tracked TypeScript files, written to `prompt_versions` on deploy (never edited in DB).

### 4.7 Embeddings

OpenAI `text-embedding-3-small` (1536-dim). Embedded sources:

| Source | Content | Use |
|---|---|---|
| `intervention_outcomes` | narrative + type + species + region | similar-precedent retrieval |
| `species_profiles` | names + integrated_threats narrative | Q&A semantic search |
| `projects` (listed) | title + description + executive_summary | funder matching |
| `funder_intent_profiles` | thematic + region prefs + giving history | funder matching |

### 4.8 Streaming UX

Vercel AI SDK with Anthropic streaming. Plan sections stream in order; validator runs on completion (≤200ms); warnings (if any) render inline. Citation chips render progressively as sections arrive.

---

## 5. Data Integration & ETL

### 5.1 Spatial framework

H3 hexagons at resolutions 5 (~252 km²), 6 (~36 km²), 7 (~5 km²). Every record gets H3-indexed at all three resolutions on ingest. Layer 2 joins are H3-cell joins. PostGIS retains native geometries for visualization.

### 5.2 Source-by-source plan

| Source | Method | Cadence | Runner |
|---|---|---|---|
| GBIF occurrences | On-demand fetch + 30d cache | On query | Vercel Cron + API route |
| IUCN assessments | Bulk import + delta sync | Quarterly | GitHub Actions |
| IUCN range maps | Shapefile → PostGIS | Annually | GitHub Actions |
| WDPA | Shapefile → PostGIS, simplified for tiles | Monthly | GitHub Actions |
| GFW GLAD/RADD | API delta by species range bbox | Daily | Vercel Cron |
| LandMark ILC | Shapefile → PostGIS | Quarterly | GitHub Actions |
| WorldClim | Static raster, ref stored | Manual | Manual seed |
| CMIP6 | Per scenario raster | Per release | Manual seed |
| HFI | Per release raster | Annually | Manual seed |
| eBird, OBIS, iNat | Same as GBIF | On query | Vercel Cron |

### 5.3 Layer 2 computation: hybrid eager / lazy

**Eager (precomputed) priority set:**
- Vertebrates classified VU/EN/CR by IUCN + projected entrants (~7,000 species)
- Cells = H3 res 6 within each species' IUCN range polygon (~100–10,000 cells per species)
- Total assessments: ~low millions
- Materialized nightly via `pg_cron`; tracked in `materialization_jobs`

**Lazy (on-demand):**
- Out-of-priority (species, cell) computed on first query, persisted, reused
- Stamped with `last_computed_at`; staleness check on read triggers async refresh

### 5.4 Species ID reconciliation

Anchored on GBIF backbone taxonomy. For each non-GBIF source: exact match → synonym match → fuzzy (trigram) → manual override. Initial full reconciliation as a GitHub Actions job; weekly delta thereafter.

### 5.5 `intervention_outcomes` seeding (parallel curation effort)

The corpus is novel; not an ETL job. v1 ships with a hand-curated seed of 50–100 cases, with a parallel curation plan to grow it post-launch:

**Initial seed (for v1 launch):**
- ~50–100 cases manually compiled, covering the priority species and Tier 1 regions
- Sources: ConservationEvidence.com (highest-yield), CEPF closeouts, GEF Independent Evaluation Office, USAID DEC, WWF/WCS/FFI annual reports

**Parallel curation plan (post-launch, ongoing):**
- A GitHub Actions ingest pipeline pulls semi-structured reports
- A Claude-assisted normalizer maps free text to the schema
- Output marked `verification_tier = auto`; promoted to `peer` via reviewer queue
- Practitioners contribute new cases via the project closeout flow (Pillar 7)

### 5.6 Refresh & job governance

`materialization_jobs` records every ETL run with status, rows processed, errors. `source_refresh_log` tracks per-source last-synced and next-due timestamps. A `data_provenance` view returns the source set + timestamps for any Layer 2 row — required for AI citation provenance.

### 5.7 Switch trigger

Stay on GitHub Actions free tier for v1. Migrate bulk ETL to a Fly.io worker once paying customers exist (re-downloading WDPA monthly is the main pain point that motivates a persistent volume).

---

## 6. Frontend, Auth & Access Control

### 6.1 Route structure

```
app/
  (marketing)/         → /, /about, /how-it-works
  (auth)/              → /login, /signup, /callback
  (funder)/            → /marketplace, /projects/[id], /portfolio,
                         /scenario  (scaffold only, "coming soon")
  (practitioner)/      → /projects, /projects/new, /projects/[id],
                         /outcomes
  (explore)/           → /species/[gbifKey], /species/[gbifKey]/loc/[h3],
                         /map
  (generic)/           → /explore, /api-docs (placeholder)
  admin/               → /admin (role-gated)
  api/                 → /ai/plan, /ai/qa, /ai/match,
                         /etl/[source], /webhooks/gfw,
                         /species/[gbifKey]
```

Marketplace is publicly browseable (read-only); project creation, funding pledging, and outcome reporting require auth.

### 6.2 Auth

Supabase Auth: email + password, Google OAuth. No magic links in v1. Role chosen at signup; one role per user; switchable from header (re-renders persona-default views). Admin role seeded via SQL — no public path.

### 6.3 Org-profile gate

**Hard-block** listing (practitioner) and pledging (funder) until `org_profiles` is complete and submitted for review. Browsing and project drafts allowed without it.

### 6.4 State & data fetching

- RSC for first paint with Supabase server client (RLS-aware)
- Server Actions for mutations
- TanStack Query for client-side derived data
- Vercel AI SDK for streamed AI output
- Supabase Realtime subscriptions for project status, threat alerts, funding events
- Zustand for ephemeral UI state (map filters, search inputs)

### 6.5 Maps

MapLibre GL JS via `react-map-gl`. OpenMapTiles base initially; vector tiles for ranges + WDPA generated via `tippecanoe` in GitHub Actions, stored in Supabase Storage. Layers (each toggleable, each paired with confidence overlay): occurrences, ranges, protected areas, GFW alerts, ILC lands, H3 confidence grid, project pins. Confidence overlay default-on for first-time users in any region.

### 6.6 Trust UX components (standardized, used everywhere)

```
<ConfidenceChip score={71} band="moderate" />
<CitationChip sources={["intervention_outcomes:1234"]} />
<DataGapsPanel gaps={[...]} />
<ProvenancePopover sources={[...]} />
<AIDisclosureBadge tier="reviewed" | "unreviewed" />
<HowWasThisGenerated outputId={...} />
```

Required next to every AI output, every numerical claim, every data view. This is the visible part of the differentiation.

### 6.7 Component library

shadcn/ui primitives + custom: `SpeciesCard`, `ProjectCard`, `MapCanvas`, `MarketplaceFilters`, `InterventionPlanRenderer`, `OutcomeReportForm`, `ThreatBadge`, `IUCNStatusBadge`.

---

## 7. Vertical Slice — Screen by Screen

### 7.1 Landing & onboarding

- `/` — public landing, persona value props, CTA to signup or browse marketplace
- `/signup` — role picker → email/Google → user record
- Org-profile modal triggered on first listing/pledging attempt

### 7.2 Practitioner: Project Builder

`/practitioner/projects/new` — multi-step wizard, draft saved continuously.

1. **Species** — search → on-demand GBIF lookup → `species_profiles` populated → SpeciesProfileHeader rendered
2. **Location** — map pin → reverse-geocode → trigger `species_location_assessment` (lazy compute if not precomputed) → integrated threat panel + DataGapsPanel
3. **AI plan** — `POST /api/ai/plan` (streaming) → server builds retrieval bundle, calls Claude with structured-output prompt, validates (soft-warn), persists `ai_outputs`, streams parsed plan back
4. **Review & edit** — practitioner edits text/budget/interventions; original output preserved in `ai_outputs`; "Why this number?" expands `<HowWasThisGenerated>`
5. **Submit** — validation: org_profile complete, fields filled, budget reconciled → `projects.status = submitted` → admin queue

After admin approval: `status = listed`, project embedding written to `ai_embeddings`, project visible on marketplace.

### 7.3 Funder: Marketplace

- `/funder/marketplace` — public read; filters (species, country, intervention type, budget, urgency, confidence band, ILC-led, Tier-2/3 region toggles); sort by match score (auth required), recency, urgency, budget
- `/funder/projects/[id]` — full plan render via `<InterventionPlanRenderer>`, map, practitioner panel, similar precedents, sidebar actions
- **Pledge flow** — modal for amount + message → `funding_commitments` (`status=pledged`) → email to admin + practitioner → admin confirms post fiscal-sponsor receipt → `status=confirmed`
- `/funder/portfolio` — Active / Completed / Watching tabs; realtime updates for status and alerts

### 7.4 Outcome reporting

`/practitioner/outcomes` — list of funded projects with reporting due. `<OutcomeReportForm>` captures metrics + narrative + evidence uploads. Submitted reports go to admin verification queue; verified reports become public on funder portfolio + project page.

### 7.5 Admin

`/admin` (role-gated):
- Org verification queue
- Project approval queue
- Funding confirmation queue (post fiscal-sponsor receipt)
- Outcome verification queue
- Disputed observations / outcomes
- AI output flag review (reproduce from audit trail; patch prompt or retrieval)

All actions logged in `admin_actions`.

### 7.6 Notifications

Email via Resend + in-app via Supabase Realtime. Triggers: funding pledge, project approval/rejection, outcome report due/overdue, threat alert in watched cell, weekly funder match digest.

---

## 8. Out of Scope (v1)

- Plants, invertebrates, fungi (vertebrates only)
- Native mobile / offline package (responsive web only)
- Ecosystem-level Red List assessments
- Public commercial API (internal `service_role` only)
- Real-time collaborative editing
- In-platform messaging (deferred to email)
- Crypto / blockchain
- Multilingual generation
- Stripe / on-platform money movement (off-platform via fiscal sponsor)
- Scenario modeler interactive sliders (route scaffolded only)
- Shadow IUCN assessments
- Full grant document drafting

---

## 9. Open Questions / TBDs

1. **Fiscal sponsor.** Sea and Sage Audubon Society as starting candidate; final partner TBD. Affects funding flow legal structure and tax-receipt mechanics.
2. **Data licensing.** GBIF / IUCN / GFW redistribution terms need legal review before any commercial API surface or bulk-export feature.
3. **Tier-1 launch regions.** PRD recommends California + PNW + Florida + a LATAM country (e.g., Costa Rica). To be confirmed during implementation.
4. **Outcome verification methodology.** What counts as verified? Self-report + peer review (v1 default) vs. third-party / remote-sensing-confirmed (post-v1). Likely tiered.
5. **Pricing.** Funder platform fee (1–3% routed) vs. enterprise license tier — needs user research before going live.
6. **Indigenous data sovereignty.** Adopt CARE principles. ILC veto on land-data display. Co-design with ILC partners (ICCA Consortium / Forest Peoples Programme as candidates).

---

## 10. Success Criteria for the Slice

The vertical slice is shippable when:

- A practitioner can sign up, complete an org profile, search a species via GBIF, pin a location, and receive a Claude-generated, citation-validated intervention plan with real Layer 2 data behind it.
- A funder can sign up, browse listed projects, view a full plan with citations and confidence chips, and pledge funding (recorded; off-platform settlement via fiscal sponsor).
- Admin can verify orgs, approve projects, confirm funding, and verify outcome reports through the admin console.
- A practitioner can submit an outcome report; verified reports update the public project page.
- The data layer is real: GBIF, IUCN, WDPA, and GFW are integrated; `species_location_assessments` is materialized for the priority set; `intervention_outcomes` has a hand-curated seed of 50–100 cases.
- Every AI output carries citations, a confidence chip, and an audit trail reproducible from `ai_outputs`.

---

*End of design spec.*
