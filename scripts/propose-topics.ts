import { readFileSync, statSync } from 'node:fs'
import { guides } from '@/data/guides'
import { newsPosts } from '@/data/news'
import { parseQueriesCsv, findOpportunities, type PageMeta } from '@/lib/searchConsole'

const MAX_AGE_DAYS = 60

const file = process.argv[2]

if (!file) {
  console.error('Usage: npx vite-node scripts/propose-topics.ts docs/search-console/<export>.csv')
  process.exit(1)
}

let stat
try {
  stat = statSync(file)
} catch {
  console.error(`File not found: ${file}`)
  process.exit(1)
}

const ageDays = (Date.now() - stat.mtimeMs) / 86_400_000
if (ageDays > MAX_AGE_DAYS) {
  console.error(
    `CSV is ${Math.round(ageDays)} days old (> ${MAX_AGE_DAYS}). ` +
      'Export a fresh Queries CSV from Search Console before proposing topics.',
  )
  process.exit(1)
}

const pages: PageMeta[] = [
  ...guides.map((g) => ({
    path: `/guides/${g.slug}/`,
    text: `${g.slug} ${g.title} ${g.description}`,
  })),
  ...newsPosts.map((p) => ({
    path: `/news/${p.slug}/`,
    text: `${p.slug} ${p.title} ${p.description}`,
  })),
]

const rows = parseQueriesCsv(readFileSync(file, 'utf8'))
const opps = findOpportunities(rows, pages)

console.log(
  JSON.stringify(
    {
      exportedFile: file,
      gaps: opps.filter((o) => o.kind === 'gap'),
      page2: opps.filter((o) => o.kind === 'page-2'),
    },
    null,
    2,
  ),
)
