import type { SupabaseClient } from '@supabase/supabase-js'
import { fetchRecentAlerts } from './client'
import { cellsForPoint } from '@/lib/etl/h3'
import { isFiniteCoord, pointWkt } from '@/lib/etl/geometry'

export async function syncRecentAlerts(
  client: SupabaseClient,
  sinceHours = 24,
): Promise<{ inserted: number; skipped: number }> {
  const since = new Date(Date.now() - sinceHours * 3600_000).toISOString()
  const alerts = await fetchRecentAlerts(since)

  let inserted = 0, skipped = 0
  const rows = alerts.flatMap((a) => {
    if (!isFiniteCoord(a.latitude, a.longitude)) { skipped++; return [] }
    return [{
      alert_type: 'integrated',
      location: pointWkt(a.longitude, a.latitude),
      h3_r6: cellsForPoint(a.latitude, a.longitude).r6,
      detected_at: a.alert_date,
      confidence_level: a.confidence,
      raw_payload: a as unknown as Record<string, unknown>,
    }]
  })

  if (rows.length > 0) {
    const { error, count } = await client
      .from('src_gfw_alerts')
      .insert(rows, { count: 'exact' })
    if (error) throw error
    inserted = count ?? rows.length
  }
  return { inserted, skipped }
}
