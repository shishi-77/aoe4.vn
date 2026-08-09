import { existsSync } from 'node:fs'
import { factsSheetPath } from '@/lib/factsSheet'

/**
 * The filesystem half of the facts-sheet gate. Kept in `scripts/` so `src/lib`
 * stays free of `node:fs`; the rule itself lives in `@/lib/factsSheet`.
 *
 * Paths are relative to the repo root, which is where every script here runs.
 */
export function hasFactsSheet(slug: string): boolean {
  return existsSync(factsSheetPath(slug))
}
