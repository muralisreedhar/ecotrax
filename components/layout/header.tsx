import Link from 'next/link'
import { getSessionUser } from '@/lib/auth/role'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/lib/auth/actions'
import { RoleSwitcher } from './role-switcher'

export async function Header() {
  const user = await getSessionUser()
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">Ecotrax</Link>
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <RoleSwitcher currentRole={user.role} />
              <span className="text-muted-foreground">{user.email}</span>
              <form action={signOutAction}>
                <Button type="submit" variant="ghost" size="sm">Sign out</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link href="/signup"><Button size="sm">Sign up</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
