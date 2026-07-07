import { getGuideBySlug } from '@/data/guides'
import { scoreGuideSeo, seoHygiene } from '@/lib/guideSeo'

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

console.log(JSON.stringify({ ...scoreGuideSeo(guide), hygiene: seoHygiene(guide) }, null, 2))
