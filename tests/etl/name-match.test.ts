import { describe, it, expect } from 'vitest'
import { matchClassify, trigramSimilarity } from '@/lib/etl/name-match'

describe('matchClassify', () => {
  it('identifies exact matches', () => {
    expect(matchClassify('Panthera tigris', 'Panthera tigris')).toEqual({
      method: 'exact',
      confidence: 1,
    })
  })
  it('identifies fuzzy matches above threshold', () => {
    const r = matchClassify('Panthera tigris', 'Panthera Tigris')
    expect(r.method).toBe('fuzzy')
    expect(r.confidence).toBeGreaterThan(0.9)
  })
  it('rejects matches below threshold', () => {
    const r = matchClassify('Panthera tigris', 'Felis catus')
    expect(r.method).toBe('none')
  })
})

describe('trigramSimilarity', () => {
  it('returns 1 for identical strings', () => {
    expect(trigramSimilarity('foo', 'foo')).toBe(1)
  })
  it('returns 0 for empty inputs', () => {
    expect(trigramSimilarity('', 'foo')).toBe(0)
    expect(trigramSimilarity('foo', '')).toBe(0)
  })
  it('returns intermediate value for similar strings', () => {
    const s = trigramSimilarity('panthera tigris', 'panthera tigirs')
    expect(s).toBeGreaterThan(0.6)
    expect(s).toBeLessThan(1)
  })
})
