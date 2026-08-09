import { existsSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { auditContent } from '@/lib/seoAudit'
import { factsSheetPath } from '@/lib/factsSheet'
import { guides, type Guide } from '@/data/guides'
import { newsPosts, type NewsPost } from '@/data/news'

const EM_DASH = '\u2014'

/** Fixture articles are all `strategy`, so the facts-sheet rule never fires for them. */
const noSheets = () => false

/**
 * The real-content sweep must hit the real filesystem. Stubbing it here would turn
 * the facts-sheet gate back into a rule nobody enforces, which is exactly what
 * putting it in the audit was meant to stop.
 */
const hasFactsSheetOnDisk = (slug: string) => existsSync(factsSheetPath(slug))

const goodGuide: Guide = {
  slug: 'bai-chuan-vi-du',
  title: 'Bài hướng dẫn ví dụ đạt chuẩn SEO',
  description: 'Mô tả bài hướng dẫn ví dụ dài quá năm mươi ký tự để qua cổng vệ sinh.',
  kind: 'strategy',
  updatedAt: '2026-08-02',
  cta: true,
  sections: [{ heading: 'Mục', paragraphs: ['Đoạn.'], link: { slug: 'x', label: 'x' } }],
}

describe('auditContent', () => {
  it('nội dung chuẩn -> không có finding', () => {
    expect(auditContent([goodGuide], [], noSheets)).toEqual([])
  })

  it('guide hỏng hygiene -> finding kèm path /guides/<slug>/', () => {
    const bad: Guide = { ...goodGuide, cta: undefined, sections: [{ heading: 'M', paragraphs: ['P'] }] }
    const findings = auditContent([bad], [], noSheets)
    expect(findings).toHaveLength(1)
    expect(findings[0].path).toBe('/guides/bai-chuan-vi-du/')
    expect(findings[0].failures.length).toBeGreaterThan(0)
  })

  it('em-dash trong nội dung -> finding', () => {
    const bad: Guide = {
      ...goodGuide,
      sections: [{ heading: 'M', paragraphs: [`Đoạn có ${EM_DASH} gạch dài.`], link: { slug: 'x', label: 'x' } }],
    }
    const findings = auditContent([bad], [], noSheets)
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
    const findings = auditContent([], [badNews], noSheets)
    expect(findings[0].path).toBe('/news/tin-vi-du/')
  })

  it('bài comparison thiếu facts sheet -> finding', () => {
    const comparison: Guide = { ...goodGuide, kind: 'comparison' }
    const findings = auditContent([comparison], [], noSheets)
    expect(findings[0].failures.some((f) => f.includes('missing facts sheet'))).toBe(true)
  })

  it('bài strategy không bị đòi facts sheet', () => {
    expect(auditContent([goodGuide], [], noSheets)).toEqual([])
  })

  it('nội dung thật trên site hiện không có finding nào', () => {
    expect(auditContent(guides, newsPosts, hasFactsSheetOnDisk)).toEqual([])
  })
})
