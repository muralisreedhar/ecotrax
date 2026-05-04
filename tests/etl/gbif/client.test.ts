import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchOccurrencesByTaxon, fetchTaxon } from '@/lib/etl/gbif/client'

afterEach(() => vi.restoreAllMocks())

describe('GBIF client', () => {
  it('fetchTaxon hits the species endpoint and returns the parsed body', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ key: 5219404, scientificName: 'Panthera tigris' })),
    )
    const taxon = await fetchTaxon(5219404)
    expect(taxon.scientificName).toBe('Panthera tigris')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/species/5219404'),
      expect.any(Object),
    )
  })

  it('fetchTaxon throws on non-OK response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('not found', { status: 404 }))
    await expect(fetchTaxon(999999999)).rejects.toThrow(/404/)
  })

  it('fetchOccurrencesByTaxon yields all pages until endOfRecords', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({
        offset: 0, limit: 2, endOfRecords: false,
        results: [{ key: 'a' }, { key: 'b' }],
      })))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        offset: 2, limit: 2, endOfRecords: true,
        results: [{ key: 'c' }],
      })))
    const collected: unknown[] = []
    for await (const page of fetchOccurrencesByTaxon(5219404, { limit: 2 })) {
      collected.push(...page)
    }
    expect(collected.map((r: any) => r.key)).toEqual(['a', 'b', 'c'])
  })

  it('fetchOccurrencesByTaxon stops on empty results', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ offset: 0, limit: 300, endOfRecords: false, results: [] })),
    )
    const pages: unknown[][] = []
    for await (const page of fetchOccurrencesByTaxon(5219404)) {
      pages.push(page)
    }
    expect(pages.length).toBe(0)
  })
})
