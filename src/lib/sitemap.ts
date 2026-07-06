import type { Guide } from '@/data/guides'

/** Ngày YYYY-MM-DD mới nhất trong danh sách guide. */
function latestGuideDate(guides: Guide[]): string {
  return guides.reduce((max, g) => (g.updatedAt > max ? g.updatedAt : max), '')
}

interface SitemapEntry {
  loc: string
  lastmod?: string
}

/** Sinh nội dung sitemap.xml. lastmod chỉ phát cho URL có ngày. */
export function buildSitemapXml(base: string, guides: Guide[]): string {
  const entries: SitemapEntry[] = [
    { loc: '/' },
    { loc: '/faq/' },
    { loc: '/tournaments/' },
    { loc: '/tournaments/lac-hong/' },
    { loc: '/tournaments/ha-noi-open-1/' },
    { loc: '/guides/', lastmod: latestGuideDate(guides) },
    ...guides.map((g) => ({ loc: `/guides/${g.slug}/`, lastmod: g.updatedAt })),
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
