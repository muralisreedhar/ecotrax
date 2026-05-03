import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

declare global {
  // eslint-disable-next-line no-var
  var __pg: ReturnType<typeof postgres> | undefined
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required')

const client = global.__pg ?? postgres(connectionString, { prepare: false })
if (process.env.NODE_ENV !== 'production') global.__pg = client

export const db = drizzle(client, { schema })
export type Db = typeof db
