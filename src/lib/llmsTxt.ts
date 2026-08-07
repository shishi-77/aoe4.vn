import type { Guide } from '@/data/guides'
import type { NewsPost } from '@/data/news'
import type { FaqItem } from '@/data/faq'
import type { TournamentData } from '@/data/tournaments/types'
import type { site as siteData } from '@/data/site'
// Relative import, not the usual '@/' alias: this module is imported directly
// from vite.config.ts, which loads before the alias exists (see vite.config.ts
// for the same exception applied to src/data/tournaments/data).
import {
  guideToMarkdown,
  newsPostToMarkdown,
  faqToMarkdown,
  tournamentToMarkdown,
} from './contentMarkdown'

type Site = typeof siteData

export interface LlmsInput {
  site: Site
  guides: Guide[]
  news: NewsPost[]
  faq: FaqItem[]
  tournaments: TournamentData[]
}

export interface GeneratedFile {
  /** Path relative to dist, forward slashes, no leading slash. */
  path: string
  content: string
}

/** Newest first, matching the order NewsView shows to readers. */
function newestFirst(news: NewsPost[]): NewsPost[] {
  return [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/** Shared opening block of both llms.txt and llms-full.txt. */
function header(site: Site): string {
  return [`# ${site.name}`, '', `> ${site.description} Toàn bộ nội dung viết bằng tiếng Việt.`].join(
    '\n',
  )
}

export function buildLlmsTxt(input: LlmsInput): string {
  const { site, guides, faq, tournaments } = input
  const news = newestFirst(input.news)

  const lines = [
    header(site),
    '',
    `Bản đầy đủ gộp một file: ${site.url}/llms-full.txt`,
    '',
    '## Hướng dẫn',
    '',
    ...guides.map((g) => `- [${g.title}](${site.url}/guides/${g.slug}.md): ${g.description}`),
    '',
    '## Tin tức',
    '',
    ...news.map((p) => `- [${p.title}](${site.url}/news/${p.slug}.md): ${p.description}`),
    '',
    '## Câu hỏi thường gặp',
    '',
    `- [Đế chế 4 - câu hỏi thường gặp](${site.url}/faq.md): ${faq.length} câu giải đáp nhanh cho người mới.`,
    '',
    '## Giải đấu',
    '',
    ...tournaments.map(
      (t) =>
        `- [${t.name}](${site.url}/tournaments/${t.slug}/): ${t.dateLabel}, ${t.venue.name}, tổng giải thưởng ${t.prizePoolTotal}.`,
    ),
  ]

  return `${lines.join('\n')}\n`
}

export function buildLlmsFullTxt(input: LlmsInput): string {
  const { site, guides, faq, tournaments } = input
  const news = newestFirst(input.news)

  const parts = [
    `${header(site)}\n\nBản mục lục: ${site.url}/llms.txt`,
    faqToMarkdown(faq, site).trimEnd(),
    ...guides.map((g) => guideToMarkdown(g, site).trimEnd()),
    ...news.map((p) => newsPostToMarkdown(p, site).trimEnd()),
    ...tournaments.map((t) => tournamentToMarkdown(t, site).trimEnd()),
  ]

  return `${parts.join('\n\n---\n\n')}\n`
}

export function buildMarkdownFiles(input: LlmsInput): GeneratedFile[] {
  const { site, guides, faq } = input

  const files: GeneratedFile[] = [
    { path: 'faq.md', content: faqToMarkdown(faq, site) },
    ...guides.map((g) => ({ path: `guides/${g.slug}.md`, content: guideToMarkdown(g, site) })),
    ...input.news.map((p) => ({ path: `news/${p.slug}.md`, content: newsPostToMarkdown(p, site) })),
  ]

  const seen = new Set<string>()
  for (const file of files) {
    if (seen.has(file.path)) throw new Error(`buildMarkdownFiles: path trùng "${file.path}"`)
    seen.add(file.path)
  }

  return files
}
