import 'dotenv/config'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import postgres from 'postgres'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is required')

  const sql = postgres(url, { max: 1 })
  const dir = join(process.cwd(), 'db', 'migrations')
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()

  await sql`CREATE TABLE IF NOT EXISTS _migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`

  const rows = await sql<{ name: string }[]>`SELECT name FROM _migrations`
  const applied = new Set(rows.map((r) => r.name))

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip  ${file}`)
      continue
    }
    console.log(`apply ${file}`)
    const body = readFileSync(join(dir, file), 'utf8')
    await sql.unsafe(body)
    await sql`INSERT INTO _migrations (name) VALUES (${file})`
  }

  await sql.end()
  console.log('migrations complete')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
