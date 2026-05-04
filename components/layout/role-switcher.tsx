'use client'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { UserRole } from '@/lib/auth/role'
import { switchRoleAction } from '@/lib/auth/actions-role'

const LABELS: Record<UserRole, string> = {
  funder: 'Funder',
  practitioner: 'Practitioner',
  other: 'Researcher / other',
  admin: 'Admin',
}

export function RoleSwitcher({ currentRole }: { currentRole: UserRole }) {
  const router = useRouter()

  async function setRole(role: UserRole) {
    await switchRoleAction(role)
    router.refresh()
    router.push(role === 'funder' ? '/marketplace' : role === 'practitioner' ? '/projects' : '/explore')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">{LABELS[currentRole]}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(['funder', 'practitioner', 'other'] as UserRole[]).map((r) => (
          <DropdownMenuItem key={r} onClick={() => setRole(r)}>{LABELS[r]}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
