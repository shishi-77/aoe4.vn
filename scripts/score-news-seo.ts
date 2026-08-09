import { getNewsPostBySlug } from '@/data/news'
import { newsSeoHygiene } from '@/lib/newsSeo'
import { gameNamingFailures } from '@/lib/gameNaming'
import { newsProse } from '@/lib/seoAudit'
import { factsSheetFailures } from '@/lib/factsSheet'
import { hasFactsSheet } from './facts-sheet-fs'

const slug = process.argv[2]

if (!slug) {
  console.error('Usage: npx vite-node scripts/score-news-seo.ts <slug>')
  process.exit(1)
}

const post = getNewsPostBySlug(slug)

if (!post) {
  console.error(`News post not found for slug: ${slug}`)
  process.exit(1)
}

// Naming failures and the facts-sheet rule join the hygiene gate so the evaluator
// blocks on them at Bước 1 instead of relying on the grader to remember.
const seo = newsSeoHygiene(post)
const failures = [
  ...seo.failures,
  ...gameNamingFailures(newsProse(post)),
  ...factsSheetFailures('news', post.slug, hasFactsSheet),
]

console.log(
  JSON.stringify(
    { kind: 'news', hygiene: { pass: failures.length === 0, failures } },
    null,
    2,
  ),
)
