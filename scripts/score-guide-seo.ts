import { getGuideBySlug } from '@/data/guides'
import { scoreGuideSeo, seoHygiene } from '@/lib/guideSeo'
import { gameNamingFailures } from '@/lib/gameNaming'
import { guideProse } from '@/lib/seoAudit'
import { factsSheetFailures } from '@/lib/factsSheet'
import { hasFactsSheet } from './facts-sheet-fs'

const slug = process.argv[2]

if (!slug) {
  console.error('Usage: npx vite-node scripts/score-guide-seo.ts <slug>')
  process.exit(1)
}

const guide = getGuideBySlug(slug)

if (!guide) {
  console.error(`Guide not found for slug: ${slug}`)
  process.exit(1)
}

// Naming failures and the facts-sheet rule join the hygiene gate so the evaluator
// blocks on them at Bước 1 instead of relying on the grader to remember.
const seo = seoHygiene(guide)
const failures = [
  ...seo.failures,
  ...gameNamingFailures(guideProse(guide)),
  ...factsSheetFailures(guide.kind, guide.slug, hasFactsSheet),
]

console.log(
  JSON.stringify(
    {
      kind: guide.kind,
      ...scoreGuideSeo(guide),
      hygiene: { pass: failures.length === 0, failures },
    },
    null,
    2,
  ),
)
