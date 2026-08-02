import { normalizeVi } from '@/lib/guideSeo'

export interface QueryRow {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

export interface PageMeta {
  /** Route path, e.g. /guides/cach-tai-aoe4/ */
  path: string
  /** Searchable text: slug + title + description concatenated. */
  text: string
}

export interface Opportunity {
  query: string
  impressions: number
  position: number
  kind: 'gap' | 'page-2'
  coveredBy?: string
}

/** Minimum impressions for a query with no covering page to count as a gap. */
export const GAP_MIN_IMPRESSIONS = 20
/** Minimum impressions for a page-2 query to be worth improving. */
export const PAGE2_MIN_IMPRESSIONS = 10
/** Token-coverage ratio at or above which a page is considered to cover a query. */
export const COVERAGE_THRESHOLD = 0.5

function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else inQuotes = false
      } else cur += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') {
      out.push(cur)
      cur = ''
    } else cur += c
  }
  out.push(cur)
  return out
}

/** Parse "3,5%" / "1.1%" / "15.3" into a number. Thousands separators are not expected. */
function toNumber(s: string): number {
  const n = parseFloat(s.replace('%', '').replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

/**
 * Parse a Search Console "Queries" CSV export. Columns are read BY POSITION
 * (query, clicks, impressions, ctr, position) so the export language does not
 * matter; the header row is skipped.
 */
export function parseQueriesCsv(csv: string): QueryRow[] {
  return csv
    .split(/\r?\n/)
    .slice(1)
    .filter((l) => l.trim() !== '')
    .map((line) => {
      const cols = splitCsvLine(line)
      return {
        query: cols[0]?.trim() ?? '',
        clicks: toNumber(cols[1] ?? '0'),
        impressions: toNumber(cols[2] ?? '0'),
        ctr: toNumber(cols[3] ?? '0'),
        position: toNumber(cols[4] ?? '0'),
      }
    })
    .filter((r) => r.query !== '')
}

function queryTokens(query: string): string[] {
  return normalizeVi(query)
    .split(/\s+/)
    .filter((t) => t.length >= 2)
}

function coverage(tokens: string[], pageText: string): number {
  if (tokens.length === 0) return 1
  const norm = normalizeVi(pageText)
  return tokens.filter((t) => norm.includes(t)).length / tokens.length
}

/**
 * Two opportunity types, per the content-automation spec:
 * - gap: enough impressions but no page covers the query -> new article candidate
 * - page-2: a covering page sits at position 11-20 -> improve that page
 */
export function findOpportunities(rows: QueryRow[], pages: PageMeta[]): Opportunity[] {
  const opps: Opportunity[] = []
  for (const row of rows) {
    const tokens = queryTokens(row.query)
    if (tokens.length === 0) continue
    let best = 0
    let bestPath: string | undefined
    for (const page of pages) {
      const c = coverage(tokens, page.text)
      if (c > best) {
        best = c
        bestPath = page.path
      }
    }
    const covered = best >= COVERAGE_THRESHOLD
    if (!covered && row.impressions >= GAP_MIN_IMPRESSIONS) {
      opps.push({ query: row.query, impressions: row.impressions, position: row.position, kind: 'gap' })
    } else if (
      covered &&
      row.position >= 11 &&
      row.position <= 20 &&
      row.impressions >= PAGE2_MIN_IMPRESSIONS
    ) {
      opps.push({
        query: row.query,
        impressions: row.impressions,
        position: row.position,
        kind: 'page-2',
        coveredBy: bestPath,
      })
    }
  }
  return opps.sort((a, b) => b.impressions - a.impressions)
}
