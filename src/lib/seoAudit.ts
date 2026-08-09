import { seoHygiene, type SeoHygiene } from '@/lib/guideSeo'
import type { Guide } from '@/data/guides'
import { newsSeoHygiene } from '@/lib/newsSeo'
import type { NewsPost } from '@/data/news'
import { gameNamingFailures } from '@/lib/gameNaming'
import { factsSheetFailures } from '@/lib/factsSheet'

export interface AuditFinding {
  path: string
  failures: string[]
}

const EM_DASH = '\u2014'

function emDashFailures(texts: string[]): string[] {
  return texts.some((t) => t.includes(EM_DASH)) ? ['em-dash found in content (use "-")'] : []
}

function guideTexts(g: Guide): string[] {
  return [g.title, g.description, ...guideProse(g)]
}

function newsTexts(p: NewsPost): string[] {
  return [p.title, p.description, ...newsProse(p), ...p.sources.map((s) => s.label)]
}

/**
 * Reader-facing prose only. Title and description are the technical zone, where
 * abbreviations carry search traffic - the naming rule does not apply there.
 */
export function guideProse(g: Guide): string[] {
  return [
    ...g.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.link ? [s.link.label] : [])]),
    ...(g.related ?? []).map((r) => r.label),
  ]
}

export function newsProse(p: NewsPost): string[] {
  return p.sections.flatMap((s) => [s.heading, ...s.paragraphs])
}

function collect(path: string, hygiene: SeoHygiene, extra: string[]): AuditFinding[] {
  const failures = [...hygiene.failures, ...extra]
  return failures.length > 0 ? [{ path, failures }] : []
}

/**
 * Sweep all data-driven pages; one finding per page that fails any hard rule.
 *
 * `hasFactsSheet` is required rather than optional on purpose. An optional
 * predicate would let a caller silently skip the facts-sheet rule, which is the
 * same failure the rule exists to fix - a gate that only runs when someone
 * remembers it. Callers that cannot read the filesystem should pass a stub and
 * say so at the call site.
 */
export function auditContent(
  guides: Guide[],
  news: NewsPost[],
  hasFactsSheet: (slug: string) => boolean,
): AuditFinding[] {
  return [
    ...guides.flatMap((g) =>
      collect(`/guides/${g.slug}/`, seoHygiene(g), [
        ...emDashFailures(guideTexts(g)),
        ...gameNamingFailures(guideProse(g)),
        ...factsSheetFailures(g.kind, g.slug, hasFactsSheet),
      ]),
    ),
    ...news.flatMap((p) =>
      collect(`/news/${p.slug}/`, newsSeoHygiene(p), [
        ...emDashFailures(newsTexts(p)),
        ...gameNamingFailures(newsProse(p)),
        ...factsSheetFailures('news', p.slug, hasFactsSheet),
      ]),
    ),
  ]
}
