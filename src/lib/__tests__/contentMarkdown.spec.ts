import { describe, it, expect } from 'vitest'
import {
  guideToMarkdown,
  newsPostToMarkdown,
  faqToMarkdown,
  tournamentToMarkdown,
} from '@/lib/contentMarkdown'
import { site } from '@/data/site'
import { lacHong } from '@/data/tournaments/lac-hong'
import type { Guide } from '@/data/guides'
import type { NewsPost } from '@/data/news'
import type { FaqItem } from '@/data/faq'

const guide = (over: Partial<Guide> = {}): Guide => ({
  slug: 'build-order-co-ban',
  title: 'Build order cơ bản Đế chế 4',
  description: 'Thứ tự xây dựng mở đầu cho người mới.',
  kind: 'strategy',
  updatedAt: '2026-08-01',
  sections: [
    { heading: 'Mở đầu', paragraphs: ['Đoạn một.', 'Đoạn hai.'] },
    {
      heading: 'Lên đời',
      paragraphs: ['Đoạn ba.'],
      link: { slug: 'cach-tai-aoe4', label: 'Cách tải game' },
    },
  ],
  ...over,
})

const post = (over: Partial<NewsPost> = {}): NewsPost => ({
  slug: 'ra-mat-tin-tuc',
  title: 'Ra mắt chuyên mục tin tức',
  description: 'Chuyên mục mới cho cộng đồng.',
  publishedAt: '2026-08-02',
  sources: [{ label: 'Trang chủ Age of Empires', url: 'https://www.ageofempires.com/' }],
  sections: [{ heading: 'Có gì mới', paragraphs: ['Đoạn tin.'] }],
  ...over,
})

describe('guideToMarkdown', () => {
  it('phát H1 là tiêu đề, rồi description', () => {
    const md = guideToMarkdown(guide(), site)
    expect(md).toContain('# Build order cơ bản Đế chế 4')
    expect(md).toContain('Thứ tự xây dựng mở đầu cho người mới.')
  })

  it('phát mỗi section thành H2 kèm đủ mọi paragraph', () => {
    const md = guideToMarkdown(guide(), site)
    expect(md).toContain('## Mở đầu')
    expect(md).toContain('Đoạn một.')
    expect(md).toContain('Đoạn hai.')
    expect(md).toContain('## Lên đời')
    expect(md).toContain('Đoạn ba.')
  })

  it('link nội bộ trỏ bản HTML tuyệt đối có dấu / cuối, không trỏ .md', () => {
    const md = guideToMarkdown(guide(), site)
    expect(md).toContain(`[Cách tải game](${site.url}/guides/cach-tai-aoe4/)`)
    expect(md).not.toContain('cach-tai-aoe4.md')
  })

  it('không thêm tiền tố "Xem thêm:" trước link section, phát nguyên nhãn dữ liệu', () => {
    const md = guideToMarkdown(guide(), site)
    expect(md).not.toContain('Xem thêm:')
  })

  it('ghi URL canonical và ngày cập nhật của chính bài', () => {
    const md = guideToMarkdown(guide(), site)
    expect(md).toContain(`${site.url}/guides/build-order-co-ban/`)
    expect(md).toContain('2026-08-01')
  })

  it('phát khối Nguồn tham khảo khi guide có sources', () => {
    const md = guideToMarkdown(guide({ sources: ['https://liquipedia.net/ageofempires/'] }), site)
    expect(md).toContain('## Nguồn tham khảo')
    expect(md).toContain('- https://liquipedia.net/ageofempires/')
  })

  it('không phát khối Nguồn tham khảo khi guide không có sources', () => {
    expect(guideToMarkdown(guide(), site)).not.toContain('## Nguồn tham khảo')
  })

  it('phát khối Bài liên quan khi guide có related', () => {
    const md = guideToMarkdown(
      guide({ related: [{ slug: 'cach-tai-aoe4', label: 'Cách tải Đế chế 4' }] }),
      site,
    )
    expect(md).toContain('## Bài liên quan')
    expect(md).toContain(`- [Cách tải Đế chế 4](${site.url}/guides/cach-tai-aoe4/)`)
  })

  it('không phát khối Bài liên quan khi guide không có related', () => {
    expect(guideToMarkdown(guide(), site)).not.toContain('## Bài liên quan')
  })

  it('ném lỗi khi guide không có section nào', () => {
    expect(() => guideToMarkdown(guide({ sections: [] }), site)).toThrow(/không có section/)
  })

  it('ném lỗi khi guide slug trống', () => {
    expect(() => guideToMarkdown(guide({ slug: '' }), site)).toThrow(/thiếu slug/)
  })
})

describe('newsPostToMarkdown', () => {
  it('phát tiêu đề, ngày đăng và nội dung', () => {
    const md = newsPostToMarkdown(post(), site)
    expect(md).toContain('# Ra mắt chuyên mục tin tức')
    expect(md).toContain('2026-08-02')
    expect(md).toContain('## Có gì mới')
    expect(md).toContain('Đoạn tin.')
  })

  it('phát nguồn dạng link có nhãn', () => {
    const md = newsPostToMarkdown(post(), site)
    expect(md).toContain('## Nguồn tham khảo')
    expect(md).toContain('- [Trang chủ Age of Empires](https://www.ageofempires.com/)')
  })

  it('ghi thêm ngày cập nhật khi có', () => {
    expect(newsPostToMarkdown(post({ updatedAt: '2026-08-05' }), site)).toContain('2026-08-05')
  })

  it('không ghi Cập nhật khi updatedAt trống', () => {
    const md = newsPostToMarkdown(post({ updatedAt: undefined }), site)
    expect(md).not.toContain('Cập nhật:')
  })

  it('ném lỗi khi post slug trống', () => {
    expect(() => newsPostToMarkdown(post({ slug: '' }), site)).toThrow(/thiếu slug/)
  })

  it('không phát khối Nguồn tham khảo khi post không có sources', () => {
    const md = newsPostToMarkdown(post({ sources: [] }), site)
    expect(md).not.toContain('## Nguồn tham khảo')
  })
})

describe('faqToMarkdown', () => {
  const items: FaqItem[] = [
    { question: 'Đế chế 4 là gì?', answer: 'Là game chiến thuật thời gian thực.' },
    {
      question: 'Tải ở đâu?',
      answer: 'Trên Steam.',
      guide: { slug: 'cach-tai-aoe4', label: 'Xem cách tải' },
    },
  ]

  it('phát mỗi câu hỏi thành H2 kèm câu trả lời', () => {
    const md = faqToMarkdown(items, site)
    expect(md).toContain('## Đế chế 4 là gì?')
    expect(md).toContain('Là game chiến thuật thời gian thực.')
    expect(md).toContain('## Tải ở đâu?')
  })

  it('phát link tới guide khi câu hỏi có, không kèm tiền tố "Xem thêm:"', () => {
    const md = faqToMarkdown(items, site)
    expect(md).toContain(`[Xem cách tải](${site.url}/guides/cach-tai-aoe4/)`)
    expect(md).not.toContain('Xem thêm:')
  })

  it('không phát link nào khi item không có guide', () => {
    const itemsWithoutGuide: FaqItem[] = [
      { question: 'Đế chế 4 là gì?', answer: 'Là game chiến thuật thời gian thực.' },
    ]
    const md = faqToMarkdown(itemsWithoutGuide, site)
    expect(md).not.toContain('](')
  })
})

describe('tournamentToMarkdown', () => {
  it('nhận Tournament đầy đủ dù chỉ khai tham số là TournamentData', () => {
    const md = tournamentToMarkdown(lacHong, site)
    expect(md).toContain(`# ${lacHong.name}`)
  })

  it('phát dạng danh sách fact, không dựng đoạn văn', () => {
    const md = tournamentToMarkdown(lacHong, site)
    expect(md).toContain(`- Thể thức: ${lacHong.format} · ${lacHong.bracketFormat}`)
    expect(md).toContain(`- Thời gian: ${lacHong.dateLabel}`)
    expect(md).toContain(`- Địa điểm: ${lacHong.venue.name}`)
    expect(md).toContain(`- Tổng giải thưởng: ${lacHong.prizePoolTotal}`)
  })

  it('không nhắc tới banner', () => {
    expect(tournamentToMarkdown(lacHong, site)).not.toContain('.webp')
  })

  it('gọi tên game theo quy ước Đế chế 4, gloss tên chính thức trong ngoặc', () => {
    const md = tournamentToMarkdown(lacHong, site)
    expect(md).toContain(`Giải đấu Đế chế 4 (${lacHong.game}) do ${lacHong.organizer} tổ chức.`)
  })

  it('ném lỗi khi tournament slug trống', () => {
    expect(() =>
      tournamentToMarkdown(
        { ...lacHong, slug: '' },
        site,
      ),
    ).toThrow(/thiếu slug/)
  })
})
