import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cached: SupabaseClient | null = null

export function getServiceClient(): SupabaseClient {
  if (cached) return cached
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) {
    throw new Error(
      'getServiceClient: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY required',
    )
  }
  cached = createClient(url, key, { auth: { persistSession: false } })
  return cached
}
