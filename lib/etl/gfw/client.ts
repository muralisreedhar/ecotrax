const BASE = 'https://data-api.globalforestwatch.org'
const DATASET = 'gfw_integrated_alerts/latest'

export interface GfwAlert {
  alert_date: string
  longitude: number
  latitude: number
  confidence: 'low' | 'high' | 'highest'
  alert__id: string
}

function key(): string {
  const k = process.env.GFW_API_KEY
  if (!k) throw new Error('GFW_API_KEY not set. Register at https://www.globalforestwatch.org/.')
  return k
}

export async function fetchRecentAlerts(sinceIso: string, limit = 10000): Promise<GfwAlert[]> {
  const sql = `SELECT longitude, latitude, alert__date AS alert_date, confidence__cat AS confidence
               FROM results
               WHERE alert__date >= '${sinceIso.slice(0, 10)}'
               LIMIT ${limit}`
  const r = await fetch(`${BASE}/dataset/${DATASET}/query?sql=${encodeURIComponent(sql)}`, {
    headers: { 'x-api-key': key() },
  })
  if (!r.ok) throw new Error(`GFW query: ${r.status} ${await r.text()}`)
  const body = await r.json() as { data: Omit<GfwAlert, 'alert__id'>[] }
  return body.data.map((a, i) => ({ ...a, alert__id: `${a.alert_date}:${a.latitude}:${a.longitude}:${i}` }))
}
