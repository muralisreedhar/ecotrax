import { requireRole } from '@/lib/auth/role'
import { Header } from '@/components/layout/header'
import Link from 'next/link'

export default async function FunderLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['funder', 'admin'])
  return (
    <>
      <Header />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="w-48 shrink-0 text-sm">
          <p className="mb-2 font-semibold">Funder</p>
          <ul className="space-y-1">
            <li><Link href="/marketplace" className="hover:underline">Marketplace</Link></li>
            <li><Link href="/portfolio" className="hover:underline">Portfolio</Link></li>
          </ul>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </>
  )
}
