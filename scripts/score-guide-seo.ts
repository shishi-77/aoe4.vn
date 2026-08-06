import { getGuideBySlug } from '@/data/guides'
import { scoreGuideSeo, seoHygiene } from '@/lib/guideSeo'
import { gameNamingFailures } from '@/lib/gameNaming'
import { guideProse } from '@/lib/seoAudit'

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

// Naming failures join the hygiene gate so the evaluator blocks on them at Bước 1.
const seo = seoHygiene(guide)
const failures = [...seo.failures, ...gameNamingFailures(guideProse(guide))]

console.log(
  JSON.stringify(
    {
      kind: guide.kind ?? 'strategy',
      ...scoreGuideSeo(guide),
      hygiene: { pass: failures.length === 0, failures },
    },
    null,
    2,
  ),
)
