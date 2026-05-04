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
