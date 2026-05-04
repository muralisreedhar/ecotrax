import type { SupabaseClient } from '@supabase/supabase-js'

export interface StartJobInput {
  jobType: string
  source?: string
  scope?: Record<string, unknown>
}

export async function startJob(
  client: SupabaseClient,
  input: StartJobInput,
): Promise<number> {
  const { data, error } = await client
    .from('materialization_jobs')
    .insert({
      job_type: input.jobType,
      source: input.source,
      scope: input.scope,
      started_at: new Date().toISOString(),
      status: 'running',
    })
    .select('id')
    .single()
  if (error) throw error
  return (data as { id: number }).id
}

export interface FinishJobInput {
  status: 'success' | 'failed'
  rowsProcessed?: number
  rowsFailed?: number
  errorLog?: string
}

export async function finishJob(
  client: SupabaseClient,
  jobId: number,
  input: FinishJobInput,
): Promise<void> {
  const { error } = await client
    .from('materialization_jobs')
    .update({
      finished_at: new Date().toISOString(),
      status: input.status,
      rows_processed: input.rowsProcessed ?? 0,
      rows_failed: input.rowsFailed ?? 0,
      error_log: input.errorLog ?? null,
    })
    .eq('id', jobId)
  if (error) throw error
}

export interface RecordRefreshInput {
  source: string
  recordsAdded?: number
  recordsUpdated?: number
  nextDueAt?: Date
}

export async function recordSourceRefresh(
  client: SupabaseClient,
  input: RecordRefreshInput,
): Promise<void> {
  const { error } = await client.from('source_refresh_log').insert({
    source: input.source,
    last_synced_at: new Date().toISOString(),
    next_due_at: input.nextDueAt?.toISOString(),
    records_added: input.recordsAdded ?? 0,
    records_updated: input.recordsUpdated ?? 0,
  })
  if (error) throw error
}
