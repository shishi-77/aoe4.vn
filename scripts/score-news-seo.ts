import { getNewsPostBySlug } from '@/data/news'
import { newsSeoHygiene } from '@/lib/newsSeo'

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

console.log(JSON.stringify({ kind: 'news', hygiene: newsSeoHygiene(post) }, null, 2))
