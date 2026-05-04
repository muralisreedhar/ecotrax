import {
  pgTable, bigserial, integer, text, jsonb, timestamp, real, boolean, doublePrecision,
} from 'drizzle-orm/pg-core'
import {
  presenceTypeEnum, confidenceBandEnum, verificationTierEnum,
} from './enums'
import { geometry } from './layer1-source'

export const speciesProfiles = pgTable('species_profiles', {
  id: integer('id').primaryKey(),                         // = canonical_species_id
  scientificName: text('scientific_name').notNull(),
  commonNames: jsonb('common_names'),
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
  h3Cell: text('h3_cell').notNull(),
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
  contributorId: text('contributor_id'),                  // Layer 3 FK added later
  speciesId: integer('species_id').references(() => speciesProfiles.id),
  location: geometry('location'),
  h3Cell: text('h3_cell'),
  countryCode: text('country_code'),
  interventionType: text('intervention_type').notNull(),
  interventionSubtype: text('intervention_subtype'),
  durationMonths: integer('duration_months'),
  totalCostUsd: doublePrecision('total_cost_usd'),
  costBreakdown: jsonb('cost_breakdown'),
  outcomeMetrics: jsonb('outcome_metrics'),
  successRating: integer('success_rating'),
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
  unitDefinition: text('unit_definition').notNull(),
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
  orgId: text('org_id'),
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
  h3Cell: text('h3_cell').notNull(),
  occurrenceDensity: real('occurrence_density'),
  recencyScore: real('recency_score'),
  sourceDiversity: real('source_diversity'),
  iucnFreshness: real('iucn_freshness'),
  spatialPrecision: real('spatial_precision'),
  compositeScore: real('composite_score').notNull(),
  band: confidenceBandEnum('band').notNull(),
  computedAt: timestamp('computed_at', { withTimezone: true }).notNull().defaultNow(),
})
