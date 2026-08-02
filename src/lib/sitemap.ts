import type { Guide } from '@/data/guides'
import type { NewsPost } from '@/data/news'

/** Latest YYYY-MM-DD in a list of dates. */
function latestDate(dates: string[]): string {
  return dates.reduce((max, d) => (d > max ? d : max), '')
}

interface SitemapEntry {
  loc: string
  lastmod?: string
}

/** Effective last-modified date of a news post. */
function newsLastmod(p: NewsPost): string {
  return p.updatedAt ?? p.publishedAt
}

/** Sinh nội dung sitemap.xml. lastmod chỉ phát cho URL có ngày. */
export function buildSitemapXml(base: string, guides: Guide[], news: NewsPost[]): string {
  const entries: SitemapEntry[] = [
    { loc: '/' },
    { loc: '/faq/' },
    { loc: '/tournaments/' },
    { loc: '/tournaments/lac-hong/' },
    { loc: '/tournaments/ha-noi-open-1/' },
    { loc: '/guides/', lastmod: latestDate(guides.map((g) => g.updatedAt)) },
    ...guides.map((g) => ({ loc: `/guides/${g.slug}/`, lastmod: g.updatedAt })),
    ...(news.length > 0
      ? [{ loc: '/news/', lastmod: latestDate(news.map(newsLastmod)) }]
      : []),
    ...news.map((p) => ({ loc: `/news/${p.slug}/`, lastmod: newsLastmod(p) })),
  ]
  const body = entries
    .map((e) => {
      const lastmod = e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''
      return `  <url><loc>${base}${e.loc}</loc>${lastmod}</url>`
    })
    .join('\n')
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${body}\n</urlset>\n`
  )
}
