import { getNewsPostBySlug } from '@/data/news'
import { newsSeoHygiene } from '@/lib/newsSeo'
import { gameNamingFailures } from '@/lib/gameNaming'
import { newsProse } from '@/lib/seoAudit'

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

// Naming failures join the hygiene gate so the evaluator blocks on them at Bước 1.
const seo = newsSeoHygiene(post)
const failures = [...seo.failures, ...gameNamingFailures(newsProse(post))]

console.log(
  JSON.stringify(
    { kind: 'news', hygiene: { pass: failures.length === 0, failures } },
    null,
    2,
  ),
)
