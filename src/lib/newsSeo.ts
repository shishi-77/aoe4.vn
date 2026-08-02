import type { NewsPost } from '@/data/news'
import type { SeoHygiene } from '@/lib/guideSeo'

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Hard hygiene gate for news posts, mirroring seoHygiene for guides.
 * News-specific rule: at least one https source (traceability is the news
 * content contract - every claim must be attributable to a listed source).
 */
export function newsSeoHygiene(post: NewsPost): SeoHygiene {
  const failures: string[] = []
  if (!SLUG_RE.test(post.slug)) failures.push(`slug not clean: ${post.slug}`)
  if (post.title.length < 20 || post.title.length > 100)
    failures.push(`title length ${post.title.length} out of [20,100]`)
  if (post.description.length < 50)
    failures.push(`description length ${post.description.length} < 50`)
  if (post.sources.length === 0) failures.push('no sources (news must cite at least one)')
  if (post.sources.some((s) => !s.url.startsWith('https://')))
    failures.push('non-https source url')
  if (!DATE_RE.test(post.publishedAt)) failures.push(`publishedAt not YYYY-MM-DD: ${post.publishedAt}`)
  if (post.cta !== true) failures.push('cta not set to true')
  return { pass: failures.length === 0, failures }
}
