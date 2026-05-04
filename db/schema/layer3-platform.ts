import {
  pgTable, bigserial, uuid, integer, text, jsonb, timestamp, real, boolean,
  doublePrecision, vector,
} from 'drizzle-orm/pg-core'
import {
  userRoleEnum, orgVerificationStatusEnum, projectStatusEnum,
  milestoneStatusEnum, fundingCommitmentStatusEnum, outcomeReportStatusEnum,
  verificationTierEnum, aiCapabilityEnum,
} from './enums'
import { geometry } from './layer1-source'
import { speciesProfiles } from './layer2-integration'

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
  h3Cell: text('h3_cell'),
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
  reportingPeriod: text('reporting_period'),
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
  h3Cell: text('h3_cell'),
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
  h3Cell: text('h3_cell'),
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
  name: text('name').notNull(),
  version: text('version').notNull(),
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

export const aiEmbeddings = pgTable('ai_embeddings', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sourceType: text('source_type').notNull(),
  sourceId: integer('source_id').notNull(),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

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
  watchedH3Cells: text('watched_h3_cells').array(),
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
