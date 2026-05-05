import { config } from 'dotenv'
config({ path: '.env.local' })
config()

import { getServiceClient } from '@/lib/etl/service-client'
import { syncSpeciesOccurrences } from '@/lib/etl/gbif/sync'
import { fetchTaxon } from '@/lib/etl/gbif/client'
import { startJob, finishJob, recordSourceRefresh } from '@/lib/etl/jobs'

async function main() {
  const arg = process.argv.find((a) => a.startsWith('--gbifKey='))
  const gbifKey = arg ? Number(arg.split('=')[1]) : NaN
  if (!Number.isInteger(gbifKey) || gbifKey <= 0) {
    console.error('usage: pnpm exec tsx scripts/etl/gbif-sync-species.ts --gbifKey=<int>')
    process.exit(1)
  }
  const client = getServiceClient()
  const taxon = await fetchTaxon(gbifKey)
  console.log(`syncing GBIF occurrences for ${taxon.scientificName} (${gbifKey})`)

  const jobId = await startJob(client, {
    jobType: 'gbif:species-sync',
    source: 'gbif',
    scope: { gbifKey, scientificName: taxon.scientificName },
  })
  try {
    const result = await syncSpeciesOccurrences(client, gbifKey)
    await finishJob(client, jobId, {
      status: 'success',
      rowsProcessed: result.added + result.updated,
      rowsFailed: result.skipped,
    })
    await recordSourceRefresh(client, {
      source: `gbif:species:${gbifKey}`,
      recordsAdded: result.added,
      recordsUpdated: result.updated,
      nextDueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    console.log(JSON.stringify(result, null, 2))
  } catch (err) {
    await finishJob(client, jobId, {
      status: 'failed',
      errorLog: err instanceof Error ? err.message : String(err),
    })
    throw err
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
