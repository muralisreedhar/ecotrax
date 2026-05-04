import { requireRole } from '@/lib/auth/role'
import { Header } from '@/components/layout/header'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(['admin'])
  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </>
  )
}
