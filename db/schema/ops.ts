import { pgTable, bigserial, integer, text, jsonb, timestamp } from 'drizzle-orm/pg-core'
import { materializationStatusEnum } from './enums'

export const materializationJobs = pgTable('materialization_jobs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  jobType: text('job_type').notNull(),
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
