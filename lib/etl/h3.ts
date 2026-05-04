import { latLngToCell } from 'h3-js'
import { parse as parseWkt, type GeoJSONGeometry } from 'wellknown'

export interface H3Cells {
  r5: string
  r6: string
  r7: string
}

export function cellsForPoint(lat: number, lng: number): H3Cells {
  return {
    r5: latLngToCell(lat, lng, 5),
    r6: latLngToCell(lat, lng, 6),
    r7: latLngToCell(lat, lng, 7),
  }
}

export function cellForPolygonCenter(wkt: string, resolution: number): string {
  const parsed = parseWkt(wkt)
  if (!parsed) throw new Error(`unparseable WKT: ${wkt}`)
  const [lng, lat] = centroid(parsed)
  return latLngToCell(lat, lng, resolution)
}

function centroid(g: GeoJSONGeometry): [number, number] {
  const points = collectCoords(g)
  if (points.length === 0) throw new Error('empty geometry')
  const sum = points.reduce<[number, number]>(
    ([sx, sy], [x, y]) => [sx + x, sy + y],
    [0, 0],
  )
  return [sum[0] / points.length, sum[1] / points.length]
}

function collectCoords(g: GeoJSONGeometry): [number, number][] {
  switch (g.type) {
    case 'Point': return [[g.coordinates[0], g.coordinates[1]]]
    case 'MultiPoint':
    case 'LineString': return g.coordinates.map((c) => [c[0], c[1]])
    case 'MultiLineString':
    case 'Polygon': return g.coordinates.flat().map((c) => [c[0], c[1]])
    case 'MultiPolygon': return g.coordinates.flat(2).map((c) => [c[0], c[1]])
    case 'GeometryCollection':
      return g.geometries.flatMap(collectCoords)
  }
}
