export interface MatchResult {
  method: 'exact' | 'fuzzy' | 'none'
  confidence: number
}

export function matchClassify(a: string, b: string, threshold = 0.85): MatchResult {
  if (a === b) return { method: 'exact', confidence: 1 }
  const sim = trigramSimilarity(a.toLowerCase(), b.toLowerCase())
  if (sim >= threshold) return { method: 'fuzzy', confidence: sim }
  return { method: 'none', confidence: sim }
}

/**
 * Pads each string with two leading + one trailing space, then computes the
 * Jaccard similarity of their trigram sets. Mirrors PostgreSQL's pg_trgm
 * `similarity()` closely enough for our matching purposes.
 */
export function trigramSimilarity(a: string, b: string): number {
  const ta = trigrams(a), tb = trigrams(b)
  if (ta.size === 0 || tb.size === 0) return 0
  const inter = [...ta].filter((g) => tb.has(g)).length
  return inter / Math.max(ta.size, tb.size)
}

function trigrams(s: string): Set<string> {
  if (s.length === 0) return new Set()
  const padded = `  ${s} `
  const out = new Set<string>()
  for (let i = 0; i < padded.length - 2; i++) out.add(padded.slice(i, i + 3))
  return out
}
