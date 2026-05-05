import type { SupabaseClient } from '@supabase/supabase-js'
import { fetchOccurrencesByTaxon } from './client'
import { cellsForPoint } from '@/lib/etl/h3'
import { isFiniteCoord, pointWkt } from '@/lib/etl/geometry'

export interface SyncResult {
  added: number
  updated: number
  skipped: number
}

export async function syncSpeciesOccurrences(
  client: SupabaseClient,
  gbifKey: number,
): Promise<SyncResult> {
  let added = 0
  const updated = 0
  let skipped = 0

  for await (const page of fetchOccurrencesByTaxon(gbifKey)) {
    const rows = page.flatMap((occ) => {
      const lat = occ.decimalLatitude
      const lng = occ.decimalLongitude
      if (typeof lat !== 'number' || typeof lng !== 'number' || !isFiniteCoord(lat, lng)) {
        skipped++
        return []
      }
      const cells = cellsForPoint(lat, lng)
      return [{
        gbif_key: gbifKey,
        occurrence_id: String(occ.key),
        location: pointWkt(lng, lat),
        h3_r5: cells.r5,
        h3_r6: cells.r6,
        h3_r7: cells.r7,
        observed_at: normalizeEventDate(occ.eventDate),
        source: occ.datasetKey ?? null,
        coordinate_uncertainty_m: occ.coordinateUncertaintyInMeters ?? null,
        taxon_verified: (occ.identificationVerificationStatus ?? '').toLowerCase().includes('verified'),
        raw_payload: occ as Record<string, unknown>,
      }]
    })
    if (rows.length === 0) continue

    const { error, count } = await client
      .from('src_gbif_occurrences')
      .upsert(rows, { onConflict: 'occurrence_id', count: 'exact' })
    if (error) throw error
    added += count ?? rows.length
  }

  return { added, updated, skipped }
}

function normalizeEventDate(input: string | undefined | null): string | null {
  if (!input) return null
  // GBIF eventDate may be a full ISO timestamp, a date, a partial like "2018-02",
  // a year "2018", or a range "2018-02-01/2018-02-05". Take the first segment of
  // any range and pad partials to a full date so Postgres timestamptz accepts it.
  const first = input.split('/')[0].trim()
  if (!first) return null
  // YYYY
  if (/^\d{4}$/.test(first)) return `${first}-01-01`
  // YYYY-MM
  if (/^\d{4}-\d{2}$/.test(first)) return `${first}-01`
  // YYYY-MM-DD or full ISO
  const t = Date.parse(first)
  if (Number.isNaN(t)) return null
  return new Date(t).toISOString()
}
