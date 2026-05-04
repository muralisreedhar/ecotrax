'use server'

import { createClient } from '@/lib/supabase/server'
import type { UserRole } from './role'
import { z } from 'zod'

const SwitchRoleSchema = z.enum(['funder', 'practitioner', 'other'])

export async function switchRoleAction(role: UserRole) {
  const parsed = SwitchRoleSchema.safeParse(role)
  if (!parsed.success) return { ok: false as const, error: 'invalid role' }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'unauthenticated' }
  await supabase.from('users').update({ role: parsed.data }).eq('id', user.id)
  return { ok: true as const }
}
