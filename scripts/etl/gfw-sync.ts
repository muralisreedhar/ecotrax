import { config } from 'dotenv'
config({ path: '.env.local' })
config()

import { getServiceClient } from '@/lib/etl/service-client'
import { syncRecentAlerts } from '@/lib/etl/gfw/sync'
import { startJob, finishJob, recordSourceRefresh } from '@/lib/etl/jobs'

async function main() {
  const arg = process.argv.find((a) => a.startsWith('--since-hours='))
  const sinceHours = arg ? Number(arg.split('=')[1]) : 24
  if (!Number.isFinite(sinceHours) || sinceHours <= 0) {
    console.error('usage: pnpm exec tsx scripts/etl/gfw-sync.ts [--since-hours=24]')
    process.exit(1)
  }
  const client = getServiceClient()
  const jobId = await startJob(client, {
    jobType: 'gfw:daily-delta',
    source: 'gfw',
    scope: { sinceHours },
  })
  try {
    const result = await syncRecentAlerts(client, sinceHours)
    console.log(JSON.stringify(result, null, 2))
    await finishJob(client, jobId, {
      status: 'success',
      rowsProcessed: result.inserted,
      rowsFailed: result.skipped,
    })
    await recordSourceRefresh(client, {
      source: 'gfw',
      recordsAdded: result.inserted,
      nextDueAt: new Date(Date.now() + 24 * 3600_000),
    })
  } catch (err) {
    await finishJob(client, jobId, {
      status: 'failed',
      errorLog: err instanceof Error ? err.message : String(err),
    })
    throw err
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
