import { seoHygiene, type SeoHygiene } from '@/lib/guideSeo'
import type { Guide } from '@/data/guides'
import { newsSeoHygiene } from '@/lib/newsSeo'
import type { NewsPost } from '@/data/news'

export interface AuditFinding {
  path: string
  failures: string[]
}

const EM_DASH = '\u2014'

function emDashFailures(texts: string[]): string[] {
  return texts.some((t) => t.includes(EM_DASH)) ? ['em-dash found in content (use "-")'] : []
}

function guideTexts(g: Guide): string[] {
  return [g.title, g.description, ...g.sections.flatMap((s) => [s.heading, ...s.paragraphs])]
}

function newsTexts(p: NewsPost): string[] {
  return [
    p.title,
    p.description,
    ...p.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
    ...p.sources.map((s) => s.label),
  ]
}

function collect(path: string, hygiene: SeoHygiene, extra: string[]): AuditFinding[] {
  const failures = [...hygiene.failures, ...extra]
  return failures.length > 0 ? [{ path, failures }] : []
}

/** Sweep all data-driven pages; one finding per page that fails any hard rule. */
export function auditContent(guides: Guide[], news: NewsPost[]): AuditFinding[] {
  return [
    ...guides.flatMap((g) =>
      collect(`/guides/${g.slug}/`, seoHygiene(g), emDashFailures(guideTexts(g))),
    ),
    ...news.flatMap((p) =>
      collect(`/news/${p.slug}/`, newsSeoHygiene(p), emDashFailures(newsTexts(p))),
    ),
  ]
}
