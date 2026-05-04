'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'

const ALLOWED_ROLES = ['funder', 'practitioner', 'other'] as const

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  role: z.enum(ALLOWED_ROLES),
})

export async function signupAction(formData: FormData) {
  const parsed = SignupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
    role: formData.get('role'),
  })
  if (!parsed.success) {
    return redirect(`/signup?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? 'Invalid input')}`)
  }
  const { email, password, fullName, role } = parsed.data

  const supabase = await createClient()
  const origin = (await headers()).get('origin') ?? 'http://localhost:3000'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/callback?next=/`,
      data: { full_name: fullName, role },
    },
  })
  if (error) return redirect(`/signup?error=${encodeURIComponent(error.message)}`)

  // The auth.users → public.users trigger inserted a stub row. Update its role + name.
  if (data.user) {
    await supabase
      .from('users')
      .update({ role, full_name: fullName })
      .eq('id', data.user.id)
  }

  redirect('/login?info=check_email')
}

export async function signupWithGoogleAction(formData: FormData) {
  const role = formData.get('role')
  const fullName = formData.get('fullName')
  const parsed = z.object({
    role: z.enum(ALLOWED_ROLES),
    fullName: z.string().min(1),
  }).safeParse({ role, fullName })
  if (!parsed.success) return redirect('/signup?error=role_required')

  const supabase = await createClient()
  const origin = (await headers()).get('origin') ?? 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/callback?next=/&pending_role=${parsed.data.role}&pending_name=${encodeURIComponent(parsed.data.fullName)}`,
    },
  })
  if (error) return redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  if (data?.url) redirect(data.url)
}
