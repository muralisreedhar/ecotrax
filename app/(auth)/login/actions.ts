'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function loginWithEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  redirect('/')
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin') ?? 'http://localhost:3000'
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/callback?next=/` },
  })
  if (error) return redirect(`/login?error=${encodeURIComponent(error.message)}`)
  if (data?.url) redirect(data.url)
}
