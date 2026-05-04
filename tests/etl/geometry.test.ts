import { describe, it, expect } from 'vitest'
import {
  pointWkt, polygonWktFromGeoJson, isFiniteCoord,
} from '@/lib/etl/geometry'

describe('pointWkt', () => {
  it('formats lng/lat as POINT WKT', () => {
    expect(pointWkt(-122.4194, 37.7749)).toBe('POINT(-122.4194 37.7749)')
  })
  it('rejects NaN', () => {
    expect(() => pointWkt(NaN, 0)).toThrow()
  })
})

describe('isFiniteCoord', () => {
  it('flags valid lat/lng', () => {
    expect(isFiniteCoord(37, -122)).toBe(true)
    expect(isFiniteCoord(NaN, 0)).toBe(false)
    expect(isFiniteCoord(0, 200)).toBe(false)
    expect(isFiniteCoord(91, 0)).toBe(false)
  })
})

describe('polygonWktFromGeoJson', () => {
  it('renders a Polygon GeoJSON to WKT', () => {
    const geo = {
      type: 'Polygon' as const,
      coordinates: [[[0,0],[1,0],[1,1],[0,1],[0,0]]],
    }
    expect(polygonWktFromGeoJson(geo)).toBe('POLYGON((0 0,1 0,1 1,0 1,0 0))')
  })
  it('renders a MultiPolygon', () => {
    const geo = {
      type: 'MultiPolygon' as const,
      coordinates: [[[[0,0],[1,0],[1,1],[0,0]]]],
    }
    expect(polygonWktFromGeoJson(geo)).toBe('MULTIPOLYGON(((0 0,1 0,1 1,0 0)))')
  })
})
