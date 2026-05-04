import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const pendingRole = searchParams.get('pending_role')
  const pendingName = searchParams.get('pending_name')

  if (!code) return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`)

  // Apply pending role/name if present (only on first signup via Google).
  if (data.user && (pendingRole || pendingName)) {
    const update: Record<string, string> = {}
    if (pendingRole) update.role = pendingRole
    if (pendingName) update.full_name = pendingName
    await supabase.from('users').update(update).eq('id', data.user.id)
  }
  return NextResponse.redirect(`${origin}${next}`)
}
