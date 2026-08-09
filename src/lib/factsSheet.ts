import type { ArticleKind } from '@/lib/guideVerdict'

/** Where the claim -> source sheet for one article lives, relative to the repo root. */
export function factsSheetPath(slug: string): string {
  return `docs/facts-review/${slug}.md`
}

/**
 * Comparison guides and news posts must ship a facts sheet; strategy and utility
 * guides must not.
 *
 * The split follows what the evaluator can check them against. A strategy or
 * utility guide talks about AoE1 and AoE4, both of which have an owner-reviewed
 * store to grade against. A comparison guide reaches into AoE2/AoE3/StarCraft and
 * a news post reports events - neither has a store deep enough to settle a claim,
 * so the evaluator verifies those against the URLs the sheet cites instead.
 */
export function needsFactsSheet(kind: ArticleKind): boolean {
  return kind === 'comparison' || kind === 'news'
}

/**
 * The rule lived only in the evaluator skill's prose until 2026-08-09, so it held
 * exactly as long as whoever was grading remembered it - and `aoe4-khac-de-che-the-nao`
 * shipped without a sheet because a grading round forgot. Keep it here, where the
 * deterministic gate runs, rather than in the instructions.
 *
 * `hasFactsSheet` is injected because this module stays free of `node:fs`: the
 * filesystem lookup belongs to the scripts that can do it.
 */
export function factsSheetFailures(
  kind: ArticleKind,
  slug: string,
  hasFactsSheet: (slug: string) => boolean,
): string[] {
  if (!needsFactsSheet(kind)) return []
  return hasFactsSheet(slug) ? [] : [`missing facts sheet: ${factsSheetPath(slug)}`]
}
