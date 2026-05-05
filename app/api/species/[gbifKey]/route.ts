import { NextResponse, type NextRequest } from 'next/server'
import { getServiceClient } from '@/lib/etl/service-client'
import { syncSpeciesOccurrences } from '@/lib/etl/gbif/sync'
import { startJob, finishJob, recordSourceRefresh } from '@/lib/etl/jobs'
import { fetchTaxon } from '@/lib/etl/gbif/client'

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ gbifKey: string }> },
) {
  const { gbifKey: gbifKeyStr } = await ctx.params
  const gbifKey = Number(gbifKeyStr)
  if (!Number.isInteger(gbifKey) || gbifKey <= 0) {
    return NextResponse.json({ error: 'invalid gbifKey' }, { status: 400 })
  }

  const client = getServiceClient()
  const taxon = await fetchTaxon(gbifKey)
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
    })
    await recordSourceRefresh(client, {
      source: `gbif:species:${gbifKey}`,
      recordsAdded: result.added,
      recordsUpdated: result.updated,
      nextDueAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    return NextResponse.json({ ok: true, ...result, scientificName: taxon.scientificName })
  } catch (err) {
    await finishJob(client, jobId, {
      status: 'failed',
      errorLog: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ ok: false, error: 'sync_failed' }, { status: 500 })
  }
}

export const GET = POST
