import { describe, it, expect } from 'vitest'
import { auditContent } from '@/lib/seoAudit'
import { guides, type Guide } from '@/data/guides'
import { newsPosts, type NewsPost } from '@/data/news'

const EM_DASH = '\u2014'

const goodGuide: Guide = {
  slug: 'bai-chuan-vi-du',
  title: 'Bài hướng dẫn ví dụ đạt chuẩn SEO',
  description: 'Mô tả bài hướng dẫn ví dụ dài quá năm mươi ký tự để qua cổng vệ sinh.',
  updatedAt: '2026-08-02',
  cta: true,
  sections: [{ heading: 'Mục', paragraphs: ['Đoạn.'], link: { slug: 'x', label: 'x' } }],
}

describe('auditContent', () => {
  it('nội dung chuẩn -> không có finding', () => {
    expect(auditContent([goodGuide], [])).toEqual([])
  })

  it('guide hỏng hygiene -> finding kèm path /guides/<slug>/', () => {
    const bad: Guide = { ...goodGuide, cta: undefined, sections: [{ heading: 'M', paragraphs: ['P'] }] }
    const findings = auditContent([bad], [])
    expect(findings).toHaveLength(1)
    expect(findings[0].path).toBe('/guides/bai-chuan-vi-du/')
    expect(findings[0].failures.length).toBeGreaterThan(0)
  })

  it('em-dash trong nội dung -> finding', () => {
    const bad: Guide = {
      ...goodGuide,
      sections: [{ heading: 'M', paragraphs: [`Đoạn có ${EM_DASH} gạch dài.`], link: { slug: 'x', label: 'x' } }],
    }
    const findings = auditContent([bad], [])
    expect(findings[0].failures.some((f) => f.includes('em-dash'))).toBe(true)
  })

  it('news hỏng nguồn -> finding kèm path /news/<slug>/', () => {
    const badNews: NewsPost = {
      slug: 'tin-vi-du',
      title: 'Bản tin ví dụ đủ dài để qua cổng title',
      description: 'Mô tả bản tin ví dụ dài quá năm mươi ký tự để qua được cổng vệ sinh.',
      publishedAt: '2026-08-02',
      cta: true,
      sources: [],
      sections: [{ heading: 'M', paragraphs: ['P'] }],
    }
    const findings = auditContent([], [badNews])
    expect(findings[0].path).toBe('/news/tin-vi-du/')
  })

  it('nội dung thật trên site hiện không có finding nào', () => {
    expect(auditContent(guides, newsPosts)).toEqual([])
  })
})
