import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'funder' | 'practitioner' | 'other' | 'admin'

export interface SessionUser {
  id: string
  email: string
  role: UserRole
  fullName: string | null
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: row } = await supabase
    .from('users')
    .select('id, email, role, full_name')
    .eq('id', user.id)
    .single()

  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    role: row.role as UserRole,
    fullName: row.full_name,
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  return user
}

export async function requireRole(allowed: UserRole[]): Promise<SessionUser> {
  const user = await requireUser()
  if (!allowed.includes(user.role)) redirect('/')
  return user
}
