import { config } from 'dotenv'
config({ path: '.env.local' })
config()

import { getServiceClient } from '@/lib/etl/service-client'
import { importWdpaShapefile } from '@/lib/etl/wdpa/import'
import { startJob, finishJob, recordSourceRefresh } from '@/lib/etl/jobs'

async function main() {
  const arg = process.argv.find((a) => a.startsWith('--shapefile='))
  const path = arg?.split('=')[1]
  if (!path) {
    console.error('usage: pnpm exec tsx scripts/etl/wdpa-import.ts --shapefile=/path/to/WDPA_polygons.shp')
    process.exit(1)
  }
  const client = getServiceClient()
  const jobId = await startJob(client, { jobType: 'wdpa:bulk', source: 'wdpa', scope: { path } })
  try {
    const result = await importWdpaShapefile(client, path)
    console.log(JSON.stringify(result, null, 2))
    await finishJob(client, jobId, {
      status: 'success',
      rowsProcessed: result.processed,
      rowsFailed: result.failed,
    })
    await recordSourceRefresh(client, {
      source: 'wdpa',
      recordsAdded: result.processed,
      nextDueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
