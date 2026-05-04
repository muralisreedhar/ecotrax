import { describe, it, expect, vi } from 'vitest'
import { startJob } from '@/lib/etl/jobs'

describe('startJob', () => {
  it('returns the new id and writes a running row', async () => {
    const fakeRow = { id: 42 }
    const single = vi.fn().mockResolvedValue({ data: fakeRow, error: null })
    const select = vi.fn().mockReturnValue({ single })
    const insert = vi.fn().mockReturnValue({ select })
    const from = vi.fn().mockReturnValue({ insert })
    const client = { from } as unknown as Parameters<typeof startJob>[0]

    const id = await startJob(client, {
      jobType: 'gbif:sync',
      source: 'gbif',
      scope: { gbifKey: 1 },
    })
    expect(id).toBe(42)
    expect(from).toHaveBeenCalledWith('materialization_jobs')
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        job_type: 'gbif:sync',
        source: 'gbif',
        scope: { gbifKey: 1 },
        status: 'running',
      }),
    )
  })

  it('throws on supabase error', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: 'boom' } })
    const select = vi.fn().mockReturnValue({ single })
    const insert = vi.fn().mockReturnValue({ select })
    const from = vi.fn().mockReturnValue({ insert })
    const client = { from } as unknown as Parameters<typeof startJob>[0]

    await expect(startJob(client, { jobType: 't' })).rejects.toBeTruthy()
  })
})
