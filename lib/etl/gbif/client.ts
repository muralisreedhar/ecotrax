const BASE = 'https://api.gbif.org/v1'

export interface GbifTaxon {
  key: number
  scientificName: string
  vernacularName?: string
  rank?: string
  class?: string
  family?: string
  status?: string
}

export interface GbifOccurrence {
  key: number | string
  decimalLatitude?: number
  decimalLongitude?: number
  coordinateUncertaintyInMeters?: number
  eventDate?: string
  taxonKey: number
  scientificName?: string
  basisOfRecord?: string
  datasetKey?: string
  taxonomicStatus?: string
  identificationVerificationStatus?: string
  [k: string]: unknown
}

export async function fetchTaxon(taxonKey: number): Promise<GbifTaxon> {
  const r = await fetch(`${BASE}/species/${taxonKey}`, {
    headers: { 'User-Agent': 'Ecotrax/0.1 (+https://github.com/muralisreedhar/ecotrax)' },
  })
  if (!r.ok) throw new Error(`GBIF /species/${taxonKey}: ${r.status}`)
  return await r.json() as GbifTaxon
}

export interface OccurrenceQuery {
  limit?: number
  hasCoordinate?: boolean
  hasGeospatialIssue?: boolean
}

export async function* fetchOccurrencesByTaxon(
  taxonKey: number,
  q: OccurrenceQuery = {},
): AsyncGenerator<GbifOccurrence[]> {
  const limit = Math.min(q.limit ?? 300, 300)
  let offset = 0
  while (true) {
    const params = new URLSearchParams({
      taxonKey: String(taxonKey),
      limit: String(limit),
      offset: String(offset),
      hasCoordinate: String(q.hasCoordinate ?? true),
      hasGeospatialIssue: String(q.hasGeospatialIssue ?? false),
    })
    const r = await fetch(`${BASE}/occurrence/search?${params}`, {
      headers: { 'User-Agent': 'Ecotrax/0.1' },
    })
    if (!r.ok) throw new Error(`GBIF /occurrence/search: ${r.status}`)
    const body = await r.json() as {
      offset: number
      limit: number
      endOfRecords: boolean
      results: GbifOccurrence[]
    }
    if (body.results.length > 0) yield body.results
    if (body.endOfRecords || body.results.length === 0) return
    offset += limit
  }
}
