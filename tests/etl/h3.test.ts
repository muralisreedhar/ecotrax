import { describe, it, expect } from 'vitest'
import { cellsForPoint, cellForPolygonCenter } from '@/lib/etl/h3'

describe('cellsForPoint', () => {
  it('returns r5/r6/r7 cells for a known coordinate', () => {
    const cells = cellsForPoint(37.7749, -122.4194)
    expect(cells.r5).toMatch(/^[0-9a-f]{15}$/)
    expect(cells.r6).toMatch(/^[0-9a-f]{15}$/)
    expect(cells.r7).toMatch(/^[0-9a-f]{15}$/)
    expect(cells.r5).not.toBe(cells.r6)
    expect(cells.r6).not.toBe(cells.r7)
  })

  it('returns deterministic results for identical input', () => {
    const a = cellsForPoint(0, 0)
    const b = cellsForPoint(0, 0)
    expect(a).toEqual(b)
  })
})

describe('cellForPolygonCenter', () => {
  it('computes a cell for the centroid of a triangle', () => {
    const wkt = 'POLYGON((0 0, 1 0, 0 1, 0 0))'
    const cell = cellForPolygonCenter(wkt, 6)
    expect(cell).toMatch(/^[0-9a-f]{15}$/)
  })
})
