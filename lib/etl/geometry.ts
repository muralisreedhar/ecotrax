// Geometry types compatible with the wellknown library and ETL inputs.
export type WktPolygon = {
  type: 'Polygon'
  coordinates: number[][][]   // ring[][point][lng,lat]
}
export type WktMultiPolygon = {
  type: 'MultiPolygon'
  coordinates: number[][][][] // polygon[][ring][point][lng,lat]
}

export function isFiniteCoord(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng)
    && lat >= -90 && lat <= 90
    && lng >= -180 && lng <= 180
}

export function pointWkt(lng: number, lat: number): string {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    throw new Error(`pointWkt: non-finite coord ${lng},${lat}`)
  }
  return `POINT(${lng} ${lat})`
}

export function polygonWktFromGeoJson(
  geo: WktPolygon | WktMultiPolygon,
): string {
  if (geo.type === 'Polygon') {
    return `POLYGON(${ringsToWkt(geo.coordinates)})`
  }
  return `MULTIPOLYGON(${geo.coordinates.map((p) => `(${ringsToWkt(p)})`).join(',')})`
}

function ringsToWkt(rings: number[][][]): string {
  return rings.map((ring) =>
    `(${ring.map(([x, y]) => `${x} ${y}`).join(',')})`,
  ).join(',')
}
