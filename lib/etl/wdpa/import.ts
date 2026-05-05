import type { SupabaseClient } from '@supabase/supabase-js'
import { open } from 'shapefile'
import { polygonWktFromGeoJson, type WktPolygon, type WktMultiPolygon } from '@/lib/etl/geometry'

export interface ImportWdpaResult { processed: number; failed: number }

export async function importWdpaShapefile(
  client: SupabaseClient,
  shpPath: string,
): Promise<ImportWdpaResult> {
  let processed = 0, failed = 0
  const source = await open(shpPath)
  while (true) {
    const next = await source.read()
    if (next.done) break
    const f = next.value
    if (!f) continue
    try {
      const p = (f.properties ?? {}) as Record<string, unknown>
      const wdpaId = Number(p.WDPAID ?? p.WDPA_PID)
      if (!Number.isInteger(wdpaId)) { failed++; continue }
      const wkt = polygonWktFromGeoJson(f.geometry as unknown as WktPolygon | WktMultiPolygon)
      const row = {
        wdpa_id: wdpaId,
        name: strOrNull(p.NAME),
        boundary: wkt,
        iucn_category: strOrNull(p.IUCN_CAT),
        country_code: strOrNull(p.ISO3),
        designation: strOrNull(p.DESIG),
        status: strOrNull(p.STATUS),
        raw_payload: p,
      }
      const { error } = await client
        .from('src_wdpa_areas')
        .upsert(row, { onConflict: 'wdpa_id' })
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
