import { Header } from '@/components/layout/header'

export default function MapPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-semibold">Global map</h1>
        <p className="mt-2 text-muted-foreground">Map visualization ships in Plan 5.</p>
      </main>
    </>
  )
}
