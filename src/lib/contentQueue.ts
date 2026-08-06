export const QUEUE_STATUSES = [
  'proposed',
  'facts-pending',
  'facts-approved',
  'drafted',
  'in-pr',
  'published',
  'parked',
  'rejected',
] as const

export type QueueStatus = (typeof QUEUE_STATUSES)[number]

export interface QueueEvidence {
  query: string
  impressions: number
  position: number
  source: 'search-console' | 'manual'
}

export interface QueueItem {
  slug: string
  targetKeyword: string
  kind: 'guide' | 'news' | 'comparison'
  evidence: QueueEvidence
  status: QueueStatus
  notes?: string
  /** YYYY-MM-DD */
  createdAt: string
  /** YYYY-MM-DD */
  updatedAt: string
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Validate raw queue JSON. Returns [] when valid, else human-readable problems. */
export function validateQueue(data: unknown): string[] {
  if (!Array.isArray(data)) return ['queue must be an array']
  const problems: string[] = []
  const seen = new Set<string>()
  data.forEach((raw, i) => {
    if (typeof raw !== 'object' || raw === null) {
      problems.push(`item ${i}: not an object`)
      return
    }
    const it = raw as Partial<QueueItem>
    const label = `item ${i} (${String(it.slug ?? '?')})`
    if (typeof it.slug !== 'string' || !SLUG_RE.test(it.slug)) problems.push(`${label}: bad slug`)
    else if (seen.has(it.slug)) problems.push(`${label}: duplicate slug`)
    else seen.add(it.slug)
    if (typeof it.targetKeyword !== 'string' || it.targetKeyword.trim() === '')
      problems.push(`${label}: missing targetKeyword`)
    if (it.kind !== 'guide' && it.kind !== 'news' && it.kind !== 'comparison')
      problems.push(`${label}: bad kind`)
    if (!QUEUE_STATUSES.includes(it.status as QueueStatus)) problems.push(`${label}: bad status`)
    const ev = it.evidence as Partial<QueueEvidence> | undefined
    if (
      !ev ||
      typeof ev.query !== 'string' ||
      typeof ev.impressions !== 'number' ||
      typeof ev.position !== 'number' ||
      (ev.source !== 'search-console' && ev.source !== 'manual')
    )
      problems.push(`${label}: bad evidence`)
    for (const field of ['createdAt', 'updatedAt'] as const) {
      if (typeof it[field] !== 'string' || !DATE_RE.test(it[field] as string))
        problems.push(`${label}: ${field} not YYYY-MM-DD`)
    }
  })
  return problems
}
