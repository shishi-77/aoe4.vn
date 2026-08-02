import { describe, it, expect } from 'vitest'
import { newsPosts, getNewsPostBySlug } from '@/data/news'

describe('news collection', () => {
  it('có ít nhất một bài tin', () => {
    expect(newsPosts.length).toBeGreaterThan(0)
  })

  it('slug duy nhất và không rỗng', () => {
    const slugs = newsPosts.map((p) => p.slug)
    expect(slugs.every((s) => s.length > 0)).toBe(true)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('mọi bài có field bắt buộc và nội dung không rỗng', () => {
    for (const p of newsPosts) {
      expect(p.title.trim()).toBeTruthy()
      expect(p.description.trim().length).toBeGreaterThan(20)
      expect(p.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      if (p.updatedAt) expect(p.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(p.sections.length).toBeGreaterThan(0)
      for (const s of p.sections) {
        expect(s.heading.trim()).toBeTruthy()
        expect(s.paragraphs.length).toBeGreaterThan(0)
      }
    }
  })

  it('mọi bài tin phải truy vết được về ít nhất một nguồn https', () => {
    for (const p of newsPosts) {
      expect(p.sources.length).toBeGreaterThan(0)
      for (const src of p.sources) {
        expect(src.label.trim()).toBeTruthy()
        expect(src.url).toMatch(/^https:\/\//)
      }
    }
  })

  it('không dùng em-dash trong bất kỳ bài nào', () => {
    for (const p of newsPosts) {
      const body = [
        p.title,
        p.description,
        ...p.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
      ].join(' ')
      expect(body).not.toContain('—')
    }
  })

  it('getNewsPostBySlug trả đúng bài và undefined khi không thấy', () => {
    expect(getNewsPostBySlug('ra-mat-chuyen-muc-tin-tuc')?.slug).toBe(
      'ra-mat-chuyen-muc-tin-tuc',
    )
    expect(getNewsPostBySlug('khong-ton-tai')).toBeUndefined()
  })
})
