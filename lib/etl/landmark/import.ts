import type { SupabaseClient } from '@supabase/supabase-js'
import { open } from 'shapefile'
import { polygonWktFromGeoJson, type WktPolygon, type WktMultiPolygon } from '@/lib/etl/geometry'

export interface ImportLandmarkResult { processed: number; failed: number }

export async function importLandmarkShapefile(
  client: SupabaseClient,
  shpPath: string,
): Promise<ImportLandmarkResult> {
  let processed = 0, failed = 0
  const source = await open(shpPath)
  while (true) {
    const next = await source.read()
    if (next.done) break
    const f = next.value
    if (!f) continue
    try {
      const p = (f.properties ?? {}) as Record<string, unknown>
      const wkt = polygonWktFromGeoJson(f.geometry as unknown as WktPolygon | WktMultiPolygon)
      const row = {
        external_id: p.ID != null ? String(p.ID) : null,
        country_code: strOrNull(p.Country),
        recognition_status: strOrNull(p.Recognition),
        boundary: wkt,
        raw_payload: p,
      }
      const { error } = await client.from('src_landmark_ilc_lands').insert(row)
      if (error) throw error
      processed++
    } catch {
      failed++
    }
  }
  return { processed, failed }
}

function strOrNull(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null
}
