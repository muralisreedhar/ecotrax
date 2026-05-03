# Ecotrax: Conservation Intelligence Platform

## Product Requirements Document

**Version:** 1.0 **Date:** May 2026 **Status:** Draft for review **Author:** \[Your name\]

---

## 1\. Executive Summary

Ecotrax is a conservation intelligence platform that translates the world's biodiversity data into specific, costed, accountable conservation action — and connects funders directly to the practitioners who can execute it.

The platform is built around a core insight: every existing tool in this space (GBIF, IUCN Red List, Map of Life, Global Forest Watch, UN Biodiversity Lab, Protected Planet) is a **data viewer**. None of them tell a field biologist what to do, tell an agency where to spend, tell a funder what their dollar will accomplish, or hold any of them accountable to outcomes. They surface the problem; nobody operationalizes the solution.

Ecotrax does that operationalization. It ingests the same open data as those tools, layers GenAI-generated guidance, cost models, stakeholder maps, and impact projections on top, and routes the resulting opportunities to a marketplace where funders can fund specific, verified interventions for specific species in specific places — and watch the outcomes.

**The wedge in one sentence:** GBIF tells you where the species is; Ecotrax tells you what to do, what it costs, who can do it, and whether it worked.

---

## 2\. Problem Statement

### 2.1 The conservation funding paradox

- Global biodiversity is collapsing — vertebrate populations down \~69% since 1970 (WWF Living Planet Index).  
- Conservation is chronically underfunded — the biodiversity finance gap is estimated at $700B/year (UNEP).  
- And yet billions in philanthropic and government conservation funding are spent annually with poor accountability and unclear ROI.

The funding doesn't reach the right places because the bridge between *data* and *action* doesn't exist.

### 2.2 What's broken for each stakeholder

**Field biologists & rangers** know the species and the threats but lack tools to translate observations into funded projects, cost-out interventions, or navigate permits and stakeholders.

**Agency staff** make policy and funding decisions but rely on slow, manual cross-referencing of disparate data sources (occurrence data, range maps, threats, protected-area coverage, climate projections) to do so.

**Researchers** can access data but spend disproportionate time on data plumbing rather than analysis.

**Conservation tech professionals** build tools but lack a unified substrate of integrated, decision-ready data.

**Funders** (foundations, HNWIs, corporate ESG, governments) want to fund conservation but face three problems: (1) they don't know where their dollar matters most, (2) they can't credibly project impact, (3) they have no way to verify outcomes. Most stated reason HNW donors give for not increasing biodiversity giving: lack of confidence that funds drive measurable outcomes.

**Indigenous and local communities (ILCs)** steward \~80% of remaining biodiversity but receive a tiny fraction of conservation funding and are underrepresented on every existing platform.

### 2.3 The data-quality asymmetry problem

Regions with the highest extinction risk (Madagascar, DRC, Borneo, Mekong, Andean cloud forests, Western Ghats, parts of West Africa) have 1–2% of the GBIF occurrence density of Western Europe. Existing platforms either ignore this or render those regions as "less interesting" because fewer dots appear. This systemically diverts attention and funding *away from* where it's most needed.

---

## 3\. Vision & Strategic Wedge

### 3.1 Vision

A world where every dollar of conservation funding is directed by evidence, executed by the right people, and verified by outcome — at the species, location, and intervention level.

### 3.2 Competitive landscape (the wedge, in detail)

| Platform | What it does | What it doesn't do |
| :---- | :---- | :---- |
| GBIF.org | Aggregates 2B+ species occurrence records globally | No interpretation, no recommendations, no funding linkage |
| IUCN Red List | Authoritative extinction-risk assessments | Slow, sparse coverage, no spatial granularity for action |
| Map of Life | Species range/distribution visualization | Display layer only, no action layer |
| Global Forest Watch | Near-real-time deforestation alerts | Forest-only, no species-specific or funder-specific action paths |
| Protected Planet (WDPA) | Database of protected areas | Static reference, no project-level intelligence |
| UN Biodiversity Lab | National-level dashboards for GBF reporting | Country-scale, government users, no marketplace |
| iNaturalist | Citizen-science observations | Observations only, not interventions or outcomes |
| NatureMetrics, Wildlife Insights | Field monitoring tools | Data collection, not decision support or funding |

**Ecotrax's wedge:** the only platform that combines (a) integrated 360° view across these sources, (b) GenAI-generated, persona-specific, verifiable action guidance, (c) costed interventions with ROI projections, (d) a donor-practitioner exchange, and (e) public outcome tracking.

### 3.3 The donor-practitioner exchange as the core

The exchange is the heart of the business. Everything else exists to make the exchange credible:

- Data integration → so projects on the exchange are evidence-backed  
- AI guidance → so projects are well-scoped before they reach funders  
- Cost & ROI models → so funders can compare opportunities  
- Outcome tracking → so funders trust the platform with the next dollar  
- Local knowledge ingestion → so projects originating from the Global South aren't structurally disadvantaged

If the exchange works, Ecotrax becomes the default routing layer for conservation philanthropy.

---

## 4\. Personas

Ecotrax presents a **persona-bifurcated entry experience**. On first visit, users select their role; the homepage, navigation, default views, and AI prompts adapt accordingly. Users can switch roles freely.

### 4.1 Funder

*Foundation program officers, HNWIs, corporate ESG/sustainability leads, government/multilateral grant managers.*

- **Incentive:** maximize measurable impact per dollar; defend giving decisions to boards/stakeholders; meet ESG/CSR/regulatory commitments.  
- **Pain:** cannot evaluate or compare opportunities credibly; no outcome verification post-grant.  
- **Job-to-be-done:** "Show me high-confidence, high-impact, fundable projects matching my thematic and geographic interests, with projected ROI and ongoing accountability."  
- **Default experience:** marketplace-first; emotional \+ data-driven landing; scenario modeler; portfolio dashboard.

### 4.2 Field Biologist / NGO Practitioner

*Conservation NGO staff, independent field biologists, project leads.*

- **Incentive:** secure funding for their work; demonstrate impact; reduce admin burden.  
- **Pain:** grant-writing is opaque and slow; no platform surfaces their work to the right donors.  
- **Job-to-be-done:** "Help me scope, cost, and present a credible project on this species in this location, and connect me to funders whose intent matches."  
- **Default experience:** project-builder workspace; AI-assisted intervention planning; submission to exchange.

### 4.3 Government / Agency Staff

*National wildlife agencies, environment ministries, regional planning bodies.*

- **Incentive:** policy decisions and budget allocation defensible by evidence; meet GBF/SDG/regional commitments.  
- **Pain:** cross-referencing disparate sources for policy is slow; reporting against frameworks (Aichi, GBF, SDG) is manual.  
- **Job-to-be-done:** "Give me jurisdiction-level conservation priority dashboards and policy-grade reports."  
- **Default experience:** jurisdictional dashboards; framework-aligned reports; policy-scenario modeling.

### 4.4 Academic Researcher

*University researchers, postdocs, graduate students, conservation think-tanks.*

- **Incentive:** publish; access well-structured integrated data without months of plumbing.  
- **Pain:** every project starts with re-doing the data integration; reproducibility is hard.  
- **Job-to-be-done:** "Give me query-ready integrated biodiversity data with confidence scoring and citation-ready exports."  
- **Default experience:** data explorer; advanced query builder; API access; reproducible workflow exports.

### 4.5 Park Ranger / On-the-Ground Practitioner

*Protected-area rangers, community conservation workers, frontline staff.*

- **Incentive:** detect threats faster; record observations and outcomes; access species/threat info in the field.  
- **Pain:** field conditions are low-bandwidth, intermittent connectivity, low-resource devices.  
- **Job-to-be-done:** "Let me record observations and threats from the field, get alerts about my area, and contribute to projects."  
- **Default experience:** mobile-first lite view; observation/intervention upload; offline package (post-v1).

### 4.6 Conservation Tech Professional

*Developers, GIS analysts, conservation tech startup teams.*

- **Incentive:** build downstream tools without rebuilding data integration.  
- **Pain:** GBIF/IUCN/WDPA APIs are siloed and inconsistent.  
- **Job-to-be-done:** "Give me unified, well-documented API access to integrated conservation intelligence."  
- **Default experience:** developer portal; API docs; SDK; sandbox.

### 4.7 Indigenous & Local Community (ILC) Representative

*Indigenous land councils, community conservation leaders, local NGO staff in low-capacity regions.*

- **Incentive:** recognition of stewardship; direct access to funding; voice in priority-setting.  
- **Pain:** invisible to global platforms; intermediaries capture funding; knowledge undervalued.  
- **Job-to-be-done:** "Surface our work, our land, our knowledge directly to the global conservation community and funders."  
- **Default experience:** simplified upload flow; multilingual; ILC-led project highlighting; direct-fund mechanism.

---

## 5\. Core Product Pillars

### 5.1 Pillar 1: Integrated 360° Data Layer

The substrate. A unified, query-ready data layer combining:

- **Species occurrences** — GBIF (2B+ records), iNaturalist, eBird, OBIS (marine).  
- **Conservation status & threats** — IUCN Red List (status, threat classifications, narrative).  
- **Range maps** — IUCN, BirdLife, regional sources.  
- **Protected areas** — Protected Planet / WDPA, OECMs.  
- **Indigenous & community lands** — LandMark (WRI), national registries.  
- **Forest & land use** — Global Forest Watch (Hansen tree cover, GLAD/RADD alerts), MapBiomas.  
- **Climate** — WorldClim (current), CMIP6 (projected, multiple SSPs).  
- **Human pressure** — Human Footprint Index, road networks (OSM), mining concessions, infrastructure pipelines.  
- **Funding & projects** — historical grants from major funders (where public), CEPF, GEF databases.

**Requirements:**

- Daily-to-monthly refresh cadence per source (per source SLA).  
- Every data point carries provenance metadata (source, date, license).  
- Every aggregated metric carries a **data confidence score** (see 5.3).  
- Spatial resolution: pixel-level where available, with explicit aggregation rules.

**Open question (license review):** GBIF, IUCN, GFW each have distinct licensing terms, especially around redistribution and commercial reuse. Legal review required before public API launch. Working assumption: display \+ analysis allowed; bulk redistribution gated; commercial API may require separate agreements.

### 5.2 Pillar 2: Filtering & Scope Logic (v1)

- **Taxonomic scope (v1):** vertebrates only.  
- **Threat scope (v1):** species classified as Vulnerable (VU), Endangered (EN), Critically Endangered (CR) by IUCN, plus species projected to enter these categories within 20–40 years per climate/habitat models.  
- **Geographic scope (v1):** global from launch, with depth tiers (see 5.3.4).  
- **Future expansion:** plants, invertebrates, fungi; ecosystem-level assessments; marine extension via OBIS depth.

### 5.3 Pillar 3: Data Confidence & Honest Uncertainty

This is a strategic differentiator. Every map, recommendation, and statistic ships with a paired confidence layer.

#### 5.3.1 Data Confidence Score

A composite per spatial unit \+ species:

- Occurrence density (records per km²) vs. global/biome baseline  
- Recency (median age of records)  
- Taxonomic verification rate  
- Spatial precision (coordinate uncertainty)  
- Source diversity (single-source vs multi-source)  
- IUCN assessment freshness

Output: a 0–100 score with banded labels (Low / Moderate / High / Very High).

**Display requirement:** every map view has a "confidence overlay" toggle, on by default for first-time users in any region. Every numerical claim in AI guidance carries a confidence chip.

#### 5.3.2 Surrogate-Data Triangulation

In low-confidence regions, the system explicitly substitutes proxy signals:

- IUCN range polygons (presence-by-inference)  
- Climate-niche modeled suitability  
- Habitat presence via remote sensing  
- Indicator/co-occurring species presence  
- Historical records weighted by recency

Outputs are clearly labeled: **"Observed presence"** vs **"Inferred presence (high/medium/low)"**. This ensures Madagascar lemurs receive the same depth of treatment as Yellowstone wolves despite vast differences in raw data.

#### 5.3.3 Failure-Mode Transparency

Every species/region page includes a **"What we don't know"** section listing:

- Specific data gaps  
- Assumptions in any modeled outputs  
- Known biases (e.g., "occurrence records here are dominated by roadside surveys")  
- Plausible alternative interpretations

Counterintuitive but builds trust with sophisticated users.

#### 5.3.4 Geographic Depth Tiers

| Tier | Regions | Treatment |
| :---- | :---- | :---- |
| Tier 1 (Deep) | US, Canada, Western Europe, Australia, NZ, parts of LATAM | Full feature stack including occurrence-density visualizations and granular cost models. Pilot regions for v1 launch. |
| Tier 2 (Inferred) | Sub-Saharan Africa, South & SE Asia, Andean countries, Mesoamerica | Surrogate-triangulation-first; honest uncertainty surfaced; explicit calls for data contribution. **Strategic priority** — these regions get extra UI emphasis and donor matching weight, despite (because of) data scarcity. |
| Tier 3 (Sparse) | Central Asia, parts of MENA, polar regions | Range-map-driven, conservative claims, contribution-prompted. |

### 5.4 Pillar 4: AI-Powered Conservation Intelligence

GenAI is layered throughout. Every AI output carries citations, confidence scores, and a "How was this generated?" expander.

#### 5.4.1 Capabilities

1. **Natural-language Q\&A** over the integrated data ("Show me the 5 most threatened mammals in Madagascar where less than 20% of their range is protected and forest loss exceeded 10% in the last decade.")  
2. **Auto-generated action playbooks** by species \+ location \+ persona ("Given Sumatran tiger in Leuser Ecosystem, for an NGO practitioner, generate a 3-year intervention plan covering anti-poaching, habitat connectivity, and community engagement, with budget breakdown.")  
3. **Auto-generated PDF reports** with narrative, embedded chart snapshots, ROI projections, citations.  
4. **Scientific literature synthesis** — plain-language threat summaries built from peer-reviewed sources.  
5. **Funder/grant matchmaking** — given a project profile, surface grants/funders whose stated intent matches.  
6. **Anomaly detection & alerts** — "Deforestation in this species' range jumped 40% this month — here's a draft response plan."  
7. **Provisional ("shadow") IUCN-style assessments** for unassessed species, clearly labeled as unofficial. **Explicit caveat:** this feature ships with strong disclaimers, never overrides official IUCN status, and includes a "submit to IUCN assessor network" button to drive formal assessment.  
8. **Document drafting** — grant applications, permit forms, stakeholder briefings.  
9. **Multilingual** — recommendations and reports in English \+ 10+ languages prioritized for high-biodiversity, low-data regions (Spanish, Portuguese, French, Bahasa, Swahili, Hindi, Mandarin, Arabic, Vietnamese, Tagalog).

#### 5.4.2 Trust & verifiability requirements (non-negotiable)

- **Citations on every claim.** Every statement of fact in AI output links to its source. No unsourced claims.  
- **Confidence scoring on every output.** Per-claim and per-document.  
- **Human-in-the-loop for marketplace listings.** AI-generated project plans require practitioner sign-off before being listed on the exchange. AI-generated reports for funders carry a "Reviewed by \[domain expert\]" badge or an explicit "Unreviewed AI output" warning.  
- **Hallucination guardrails** — RAG-only over verified data sources; no parametric-knowledge claims about specific grants, species, or interventions.  
- **Audit trail.** Every AI output is reproducible from inputs \+ retrieval set \+ prompt version.

### 5.5 Pillar 5: Costed Interventions & ROI Modeling

Every recommendation translates into action and dollars.

#### 5.5.1 Last-Mile Cost Decomposition

A built-and-maintained cost database covering common intervention types, regionalized:

- Local labor rates by country/region  
- Local material costs  
- Vehicle/equipment lease rates  
- Survey & monitoring costs  
- Permit & compliance time → cost  
- NGO overhead conventions by region

A "build 5km wildlife corridor" line item in Tamil Nadu vs Montana produces materially different numbers, with the breakdown visible.

**Build approach:** seed from public NGO budgets, GEF/CEPF project closeouts, academic literature, and partner contributions; refine via crowdsourced practitioner inputs (see Pillar 7).

#### 5.5.2 ROI / Counterfactual Modeling

For each proposed intervention:

- "Do nothing" baseline projection (population, habitat, species-survival probability over 10/25/50 years)  
- "Funded at $X" projection  
- Confidence interval and historical analog basis (e.g., "California Condor recovery cost $35M over 30 years; analogous parameters here suggest…")

#### 5.5.3 Scenario Modeler

Interactive lever-based tool. Funder/agency adjusts:

- Funding level ($)  
- Geographic scope (slider over a map)  
- Duration (years)  
- Intervention mix (anti-poaching / habitat / community / policy)

Output: projected species/habitat trajectory, confidence band, cost-per-outcome metrics, comparison to baseline. This is a flagship demo experience for funder acquisition.

### 5.6 Pillar 6: Donor-Practitioner Exchange (the core)

A two-sided marketplace.

#### 5.6.1 Practitioner side

- Project builder workspace (AI-assisted scoping, budgeting, narrative drafting)  
- Verification workflow (org credentials, prior-project history, peer-reviewer optional)  
- Project listing on the marketplace once verified

#### 5.6.2 Funder side

- Browse / search / filter projects by species, geography, intervention type, budget range, urgency  
- Save-and-track shortlists  
- Direct funding (where regulatory feasible) or routing to fiscal sponsors  
- Portfolio dashboard showing all funded projects \+ outcome status

#### 5.6.3 Matching engine

AI-driven two-way matching: funder intent profile ↔ project profile. Surfaces high-match opportunities to both sides. Goes beyond keyword match — uses thematic embeddings, geographic affinity, and historical-funding patterns.

#### 5.6.4 ILC fast-track

Explicit pathway for indigenous and local community projects:

- Simplified onboarding (multilingual, lower documentation burden, alternative verification via partner organizations)  
- Highlighted in matching  
- Optional "ILC-led" filter for funders who prioritize this

#### 5.6.5 Trust & safety

- Org verification (incl. partner-vouched and ILC-pathway alternatives)  
- Anti-fraud monitoring  
- Outcome reporting required for re-listing (see Pillar 8\)  
- Public dispute resolution process

### 5.7 Pillar 7: Local Knowledge Ingestion

Two complementary contribution channels.

#### 5.7.1 Field observations

- iNaturalist-style: photo, GPS, date, optional identification  
- Designed for low-bandwidth contexts and basic devices  
- Feeds into the data layer with confidence-scoring (single observation vs corroborated, photo-verified vs not, expert-confirmed vs not)  
- Contributor reputation system

#### 5.7.2 Intervention outcomes (the novel layer)

The world has no structured, queryable database of "what conservation interventions worked, where, at what cost, with what outcome." Ecotrax builds it.

Practitioners submit:

- Intervention type (taxonomy: anti-poaching, habitat restoration, corridor, community engagement, policy advocacy, captive breeding, etc.)  
- Location (geo)  
- Duration & cost  
- Outcome metrics (population, threat reduction, behavior change)  
- Success/failure rating with narrative  
- Photos, documents, peer references

This dataset powers:

- Pillar 5 (cost models, ROI projections) with empirical priors  
- Pillar 6 (matching, by surfacing similar successful precedents to funders)  
- Pillar 8 (the leaderboard, the accountability layer)

#### 5.7.3 Moderation & verification

- Tiered verification (auto, peer, expert)  
- Required disclosures (funding source, conflicts of interest)  
- Reputation system for contributors  
- Disputed claims flagged on display

This is non-trivial platform work and is **explicitly v1 scope** because it's foundational to everything else, but with scope constraints: launch with vertebrate-focused, English/Spanish/Portuguese/French interfaces, expand languages and taxa over time.

### 5.8 Pillar 8: Outcome Tracking & Accountability (Leaderboard)

#### 5.8.1 Project tracker

Every funded project on the exchange carries a public-facing tracker:

- Commitments (what, where, when, how much)  
- Milestones (with evidence)  
- Outcome metrics (population/habitat/threat changes)  
- Funds disbursed vs spent  
- Final outcome rating

#### 5.8.2 Leaderboards

- **Project leaderboard:** top-performing projects by ROI, by impact magnitude, by cost-efficiency.  
- **Funder leaderboard:** funders by total impact funded, by portfolio ROI, by geographic/thematic specialization. (Opt-out available; expected effect: most funders opt in for reputational reasons.)  
- **Practitioner / org leaderboard:** organizations by outcome track record.  
- **Region leaderboard:** countries / sub-national regions by improvement trajectory, surfacing both leaders and laggards.

This creates positive reputational pressure on the entire conservation funding ecosystem — the unique social product of building the marketplace.

#### 5.8.3 Threat-Leading Indicators (early warning)

The opposite of lagging outcome data. Composite alerting system:

- Real-time deforestation alerts (GFW GLAD/RADD) intersected with species ranges  
- Climate anomalies in known niches  
- New mining/road/infrastructure footprints overlapping ranges  
- Human pressure index changes

Output: ranked alerts ("This species' habitat is being destroyed *right now*") with auto-generated draft response plans. Alerts route to relevant practitioners \+ funders. This catches threats 5–10 years earlier than population-based monitoring would.

### 5.9 Pillar 9: Regulatory & Stakeholder Layer

Per location \+ intervention type, surfaces:

- Required permits and issuing agencies (e.g., IBAMA in Brazil, MoEF in India, USFWS in US)  
- Typical timelines and costs for permits  
- Key local stakeholders (NGOs, agencies, ILC councils, academic partners)  
- Historical regulatory context (recent policy changes, election impacts)

Bridges the donor-practitioner gap (a Norwegian funder doesn't know what IBAMA is; a Brazilian biologist does). Also reduces project-execution risk and is a meaningful differentiator vs. all listed competitors.

### 5.10 Pillar 10: Persona-Specific Experiences

Rather than detail every screen, the principle: **same data substrate, different defaults, different prompts, different language, different surfaces.**

| Persona | Homepage anchor | Dominant surfaces | AI prompt style |
| :---- | :---- | :---- | :---- |
| Funder | Emotional impact \+ scenario modeler \+ featured projects | Marketplace, scenario modeler, portfolio dashboard, leaderboard | "What's the most impactful $X I can give in \[region\] for \[theme\]?" |
| Practitioner | Project builder \+ funder matching | Project builder, AI playbook, exchange submission | "Help me scope a 3-year project for \[species\] in \[location\] under $Y." |
| Agency | Jurisdictional dashboard \+ GBF/SDG reporting | Jurisdiction view, framework reports, policy modeler | "Generate a GBF Target 3 progress report for \[country\] with confidence ranges." |
| Researcher | Data explorer \+ advanced query | Query builder, integrated layers, API, export | "Export occurrence \+ climate \+ protected-area data for \[taxon\] in \[region\] with provenance." |
| Ranger | Map \+ observation upload \+ alerts | Mobile lite view, alerts, observations | "What threatened species are in my patrol area this week?" |
| Tech | API docs \+ sandbox | Developer portal | n/a |
| ILC | Multilingual simple upload \+ project highlighting | Simplified workspace | "Help us tell our project's story in our words." |

---

## 6\. Success Metrics

### 6.1 North-star metric

**Conservation dollars routed through the exchange to verified, outcome-tracked projects.**

This metric forces every other part of the platform to actually serve the mission.

### 6.2 Leading indicators

**Data layer**

- Sources integrated (target: 12+ within 12 months of launch)  
- Records / coverage / freshness per source  
- Data confidence score distribution by region (target: shifts upward over time as contributions grow)

**AI**

- Citation coverage on AI outputs (target: 100%)  
- AI output review-pass rate by domain experts (target: \>85%)  
- User-flagged AI errors per 1,000 outputs (target: \<5)

**Marketplace**

- Verified projects listed  
- Funders onboarded (with $-thresholds)  
- Project funding match rate  
- Median time from listing to funded  
- Funded $ and \# of projects  
- ILC-pathway projects as % of total (target: \>25%)  
- Tier-2/3 region projects as % of total (target: \>40%)

**Outcomes**

- Projects reporting outcomes  
- Outcome verification rate  
- Average ROI delta vs baseline (where measurable)

**Engagement (per persona)**

- WAU / MAU  
- Persona-specific feature adoption  
- Practitioner: projects created → submitted → funded  
- Funder: shortlist → funded → outcome-tracked

### 6.3 Mission metrics (lagging, public)

- Species lifted out of CR/EN through funded projects  
- Hectares of habitat protected/restored  
- $ to ILC-led projects  
- $ to Tier-2/3 regions

---

## 7\. Business Model

Based on the directions you flagged for further research:

### 7.1 Revenue streams (multiple, hybrid)

**(a) Funder-paid platform fee** *(primary)*

- Funders pay a small % (e.g., 1–3%) on routed funding, or flat enterprise tier for institutional funders.  
- Justification: due-diligence cost savings, outcome verification value, project sourcing.  
- Comparable: charity:water-style overhead transparency, or DAF-style platform fees (\~0.5–1% on AUM).

**(b) Grant funding (nonprofit arm)**

- Apply to biodiversity-focused funders (CEPF, GEF, Bezos Earth Fund, Bloomberg Philanthropies, Cartier for Nature, etc.) for platform operating support.  
- Justification: public-good infrastructure for the conservation ecosystem.

**(c) Enterprise / institutional licenses**

- Government agencies, multilateral orgs, large NGOs, ESG-driven corporates: paid access to advanced features (custom dashboards, embedded reports, white-label deployments, regulatory disclosure tooling).  
- *Research note:* corporate biodiversity disclosure is becoming regulatory (CSRD in EU, TNFD globally, SEC climate rules in flux). Corporates need biodiversity-impact data for their supply chains. This is potentially a significant enterprise market.

**(d) API / data access tiers** *(post-license-review)*

- Free tier for academic and small-NGO use.  
- Paid tiers for high-volume / commercial / consulting use.  
- Pending license review with GBIF, IUCN, GFW.

### 7.2 Strategic recommendation

Lead with **(a) funder-paid exchange \+ (b) grant-funded platform**. This aligns commercial incentives with mission. Keep a free tier for practitioners, researchers, rangers, ILCs — they generate the supply side and the data; the demand side (funders) pays.

(c) Enterprise becomes important as the platform matures, especially as biodiversity disclosure regulations expand. Plan for it but don't lead with it.

(d) API access deferred until licensing is sorted.

### 7.3 Open business questions for follow-up research

- What % platform fee is acceptable to foundations vs. HNW donors? (Test in user research.)  
- Fiscal sponsorship structure for international fund routing.  
- Tax-deductibility implications by funder country / project country.  
- Regulatory status (charitable solicitation registrations, FCPA-like considerations for international funding flows).  
- Data licensing terms with GBIF, IUCN, GFW for commercial use.

---

## 8\. Technical Architecture (high level)

### 8.1 Data layer

- Cloud-hosted data warehouse (BigQuery / Snowflake / similar) for tabular data.  
- Spatial index for geo data (PostGIS or equivalent).  
- Object storage for media (photos, documents, PDF reports).  
- Per-source ingestion pipelines with provenance tracking.  
- Confidence-scoring service that runs on every aggregation.

### 8.2 AI layer

- LLM backbone (Claude or comparable frontier model) for generation.  
- RAG over the integrated data layer; citation-enforcing retrieval.  
- Vector store for semantic search on intervention-outcomes corpus and literature corpus.  
- Prompt versioning \+ audit trail.  
- Eval harness with domain-expert-graded test sets.

### 8.3 Web layer

- Modern web stack (Next.js or comparable; React frontend).  
- Map rendering: Mapbox GL or MapLibre with vector tiles.  
- Persona-bifurcated routing.  
- PDF generation pipeline (server-side, citation-preserving).

### 8.4 Mobile / field

- Responsive web first. Native mobile post-v1.  
- Downloadable offline package post-v1.

### 8.5 Marketplace

- Standard two-sided marketplace stack (listings, search, messaging, KYC/verification, payment routing).  
- Payment routing via fiscal sponsor or platform-managed escrow.

---

## 9\. Risks & Mitigations

| Risk | Severity | Mitigation |
| :---- | :---- | :---- |
| Data licensing restricts commercial use | High | Early legal review with GBIF/IUCN/GFW; nonprofit arm holds licenses; commercial features layered carefully. |
| AI hallucinations damage credibility | High | RAG-only architecture; mandatory citations; expert review for marketplace listings; strong eval harness; conservative claims. |
| Shadow IUCN assessments seen as undermining authority | Medium | Strong disclaimers; explicit "submit to IUCN" pathway; advisory board including IUCN-affiliated experts; never override official status. |
| Marketplace fraud (fake projects, ghost orgs) | High | Tiered verification; partner-vouched ILC pathway; outcome reporting required for re-listing; public dispute resolution. |
| Tier-2/3 regions remain underrepresented despite intent | Medium | Explicit weighting in matching engine; ILC fast-track; multilingual; partnerships with regional NGOs and ILC networks; reduced documentation burden with alternative verification. |
| Funders won't pay platform fees | Medium | Validate via user research before launch; alternative: funder-side enterprise license; nonprofit grants as bridge. |
| Outcome reporting burden drives away practitioners | Medium | Light-touch reporting templates; AI-assisted report drafting; tie reporting to funding eligibility but keep proportional. |
| Competitor (existing platform) launches similar features | Low | Existing platforms are mission-bound to data display, not marketplace; structural conflict of interest for IUCN/GBIF to run a marketplace; speed and integration depth as moats. |
| GenAI-generated content perceived as "AI slop" | Medium | Heavy human-in-the-loop on user-facing outputs; expert review badges; citations everywhere; "How was this generated?" transparency. |
| Indigenous data sovereignty concerns | High | Adopt CARE principles (Collective benefit, Authority to control, Responsibility, Ethics); ILC veto on data display about their lands; co-design with ILC partners. |

---

## 10\. What's Out of Scope (v1)

To be explicit:

- Plants, invertebrates, fungi (vertebrates only at launch)  
- Ecosystem-level Red List assessments  
- Native mobile apps (responsive web first)  
- Offline downloadable package  
- Public API (academic API may launch earlier; commercial pending licensing)  
- Real-time collaborative project editing  
- In-platform messaging / chat for funder-practitioner negotiations (deferred to email/external for v1)  
- Crypto / blockchain anything (no clear value-add for the use case at this time)

---

## 11\. Open Questions for Continued Research

These do not block PRD approval but should be resolved before architectural lock-in:

1. Which 3–5 Tier-1 regions to launch with for fastest credibility? (Recommendation: California, Pacific Northwest, Florida — leveraging existing Ecotrax data \+ iconic species; plus Costa Rica or another LATAM country to avoid US-only optics.)  
2. Founding partnerships — which NGOs, foundations, or agencies become design partners and validate the platform pre-launch?  
3. ILC partnership organizations — which ILC networks (e.g., ICCA Consortium, Forest Peoples Programme) to engage as design partners?  
4. Outcome verification methodology — what counts as verified outcome? Self-report \+ peer review? Third-party? Remote-sensing-confirmed? Likely a tiered approach.  
5. Fiscal sponsorship structure for international fund routing.  
6. Defining the boundary between AI-generated draft and human-finalized project listing.  
7. Pricing research with target funders.  
8. Brand identity — does "Ecotrax" carry forward, or does the platform deserve a fresh name reflecting the broader ambition?

---

## Appendix A: Why now

- GBIF crossed 2B occurrence records in 2023; data substrate is finally rich enough.  
- Frontier LLMs are good enough to do reliable citation-grounded synthesis.  
- Biodiversity disclosure regulations (CSRD, TNFD) creating corporate demand.  
- Global Biodiversity Framework (Kunming-Montreal, 2022\) created national-level reporting needs.  
- Donor-advised-fund-style infrastructure is normalized; conservation funding has lagged.  
- Climate philanthropy is maturing; biodiversity is the next wave (\~10 years behind climate in funding sophistication).

## Appendix B: Why this team

\[Your background, the existing Ecotrax iPad app as proof of execution capability, prior conservation work, etc.\]

---

*End of PRD v1.0*  
