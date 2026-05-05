import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/etl/service-client'
import { syncRecentAlerts } from '@/lib/etl/gfw/sync'
import { startJob, finishJob, recordSourceRefresh } from '@/lib/etl/jobs'

export async function POST(req: Request) {
  const auth = req.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const client = getServiceClient()
  const jobId = await startJob(client, { jobType: 'gfw:daily-delta', source: 'gfw' })
  try {
    const result = await syncRecentAlerts(client, 24)
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
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    await finishJob(client, jobId, {
      status: 'failed',
      errorLog: err instanceof Error ? err.message : String(err),
    })
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export const GET = POST
