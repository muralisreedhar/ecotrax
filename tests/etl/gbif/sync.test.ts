import { describe, it, expect, vi, beforeEach } from 'vitest'

beforeEach(() => vi.resetModules())

describe('syncSpeciesOccurrences', () => {
  it('upserts occurrences with computed H3 cells; skips invalid coords', async () => {
    vi.doMock('@/lib/etl/gbif/client', () => ({
      fetchOccurrencesByTaxon: async function* () {
        yield [
          { key: 1, taxonKey: 99, decimalLatitude: 37.7, decimalLongitude: -122.4, eventDate: '2024-01-01', basisOfRecord: 'HUMAN_OBSERVATION' },
          { key: 2, taxonKey: 99, decimalLatitude: NaN, decimalLongitude: NaN },
          { key: 3, taxonKey: 99 }, // missing coords
        ]
      },
    }))

    const upsertMock = vi.fn().mockResolvedValue({ error: null, count: 1 })
    const client = {
      from: vi.fn().mockReturnValue({ upsert: upsertMock }),
    }

    const { syncSpeciesOccurrences } = await import('@/lib/etl/gbif/sync')
    const result = await syncSpeciesOccurrences(client as any, 99)
    expect(result.added).toBe(1)
    expect(result.skipped).toBe(2)
    expect(upsertMock).toHaveBeenCalledOnce()
    expect(upsertMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          gbif_key: 99,
          occurrence_id: '1',
          location: 'POINT(-122.4 37.7)',
          h3_r5: expect.stringMatching(/^[0-9a-f]{15}$/),
          h3_r6: expect.stringMatching(/^[0-9a-f]{15}$/),
          h3_r7: expect.stringMatching(/^[0-9a-f]{15}$/),
        }),
      ]),
      expect.objectContaining({ onConflict: 'occurrence_id' }),
    )
  })

  it('throws on supabase error', async () => {
    vi.doMock('@/lib/etl/gbif/client', () => ({
      fetchOccurrencesByTaxon: async function* () {
        yield [{ key: 1, taxonKey: 99, decimalLatitude: 0, decimalLongitude: 0 }]
      },
    }))
    const client = {
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ error: { message: 'boom' }, count: null }),
      }),
    }
    const { syncSpeciesOccurrences } = await import('@/lib/etl/gbif/sync')
    await expect(syncSpeciesOccurrences(client as any, 99)).rejects.toBeTruthy()
  })
})
