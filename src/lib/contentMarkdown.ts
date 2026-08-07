import type { Guide } from '@/data/guides'
import type { NewsPost } from '@/data/news'
import type { FaqItem } from '@/data/faq'
import type { TournamentData } from '@/data/tournaments/types'
import type { site as siteData } from '@/data/site'

type Site = typeof siteData

/** Absolute canonical URL of a content page, always with a trailing slash. */
function pageUrl(site: Site, path: string): string {
  return `${site.url}${path}`
}

/** Join non-empty blocks with one blank line between them, ending in a newline. */
function joinBlocks(blocks: string[]): string {
  return `${blocks.filter((b) => b.trim().length > 0).join('\n\n')}\n`
}

/** Markdown link to a guide's canonical HTML page, never to its .md mirror. */
function guideLink(site: Site, slug: string, label: string): string {
  return `Xem thêm: [${label}](${pageUrl(site, `/guides/${slug}/`)})`
}

export function guideToMarkdown(guide: Guide, site: Site): string {
  if (!guide.slug) throw new Error('guideToMarkdown: guide thiếu slug')
  if (guide.sections.length === 0) {
    throw new Error(`guideToMarkdown: guide "${guide.slug}" không có section nào`)
  }

  const blocks = [
    `# ${guide.title}`,
    guide.description,
    `Nguồn: ${pageUrl(site, `/guides/${guide.slug}/`)} · Cập nhật: ${guide.updatedAt}`,
  ]

  for (const section of guide.sections) {
    blocks.push(`## ${section.heading}`)
    blocks.push(...section.paragraphs)
    if (section.link) blocks.push(guideLink(site, section.link.slug, section.link.label))
  }

  if (guide.sources && guide.sources.length > 0) {
    blocks.push('## Nguồn tham khảo')
    blocks.push(guide.sources.map((url) => `- ${url}`).join('\n'))
  }

  return joinBlocks(blocks)
}

export function newsPostToMarkdown(post: NewsPost, site: Site): string {
  if (!post.slug) throw new Error('newsPostToMarkdown: post thiếu slug')
  if (post.sections.length === 0) {
    throw new Error(`newsPostToMarkdown: post "${post.slug}" không có section nào`)
  }

  const updated = post.updatedAt ? ` · Cập nhật: ${post.updatedAt}` : ''
  const blocks = [
    `# ${post.title}`,
    post.description,
    `Nguồn: ${pageUrl(site, `/news/${post.slug}/`)} · Đăng: ${post.publishedAt}${updated}`,
  ]

  for (const section of post.sections) {
    blocks.push(`## ${section.heading}`)
    blocks.push(...section.paragraphs)
  }

  if (post.sources.length > 0) {
    blocks.push('## Nguồn tham khảo')
    blocks.push(post.sources.map((s) => `- [${s.label}](${s.url})`).join('\n'))
  }

  return joinBlocks(blocks)
}

export function faqToMarkdown(items: FaqItem[], site: Site): string {
  if (items.length === 0) throw new Error('faqToMarkdown: không có câu hỏi nào')

  const blocks = [
    '# Đế chế 4 - câu hỏi thường gặp',
    'Giải đáp nhanh cho người mới tìm hiểu Đế chế 4.',
    `Nguồn: ${pageUrl(site, '/faq/')}`,
  ]

  for (const item of items) {
    blocks.push(`## ${item.question}`)
    blocks.push(item.answer)
    if (item.guide) blocks.push(guideLink(site, item.guide.slug, item.guide.label))
  }

  return joinBlocks(blocks)
}

export function tournamentToMarkdown(tournament: TournamentData, site: Site): string {
  if (!tournament.slug) throw new Error('tournamentToMarkdown: giải đấu thiếu slug')

  const facts = [
    `- Thể thức: ${tournament.format} · ${tournament.bracketFormat}`,
    `- Thời gian: ${tournament.dateLabel}`,
    `- Địa điểm: ${tournament.venue.name}, ${tournament.venue.address}`,
    `- Ban tổ chức: ${tournament.organizer}`,
    `- Lệ phí: ${tournament.entryFee}`,
    `- Tổng giải thưởng: ${tournament.prizePoolTotal}`,
    `- Hạn đăng ký: ${tournament.registrationDeadline}`,
  ]

  return joinBlocks([
    `# ${tournament.name}`,
    `Giải ${tournament.game} do ${tournament.organizer} tổ chức.`,
    `Nguồn: ${pageUrl(site, `/tournaments/${tournament.slug}/`)}`,
    facts.join('\n'),
  ])
}
