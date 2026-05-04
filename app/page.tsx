import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { getSessionUser } from '@/lib/auth/role'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const user = await getSessionUser()
  if (user) {
    if (user.role === 'funder') redirect('/marketplace')
    if (user.role === 'practitioner') redirect('/projects')
    if (user.role === 'admin') redirect('/admin')
    redirect('/explore')
  }
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-semibold leading-tight">
          Conservation funding, directed by evidence.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          GBIF tells you where the species is. Ecotrax tells you what to do, what
          it costs, who can do it, and whether it worked.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/signup"><Button size="lg">Get started</Button></Link>
          <Link href="/marketplace"><Button size="lg" variant="outline">Browse the marketplace</Button></Link>
        </div>
      </main>
    </>
  )
}
