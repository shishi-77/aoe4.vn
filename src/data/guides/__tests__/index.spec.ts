import { describe, it, expect } from 'vitest'
import { guides, getGuideBySlug } from '@/data/guides'

describe('guides collection', () => {
  it('có ít nhất một guide', () => {
    expect(guides.length).toBeGreaterThan(0)
  })

  it('slug duy nhất và không rỗng', () => {
    const slugs = guides.map((g) => g.slug)
    expect(slugs.every((s) => s.length > 0)).toBe(true)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('mọi guide có field bắt buộc và nội dung không rỗng', () => {
    for (const g of guides) {
      expect(g.title.trim()).toBeTruthy()
      expect(g.description.trim().length).toBeGreaterThan(20)
      expect(g.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(g.sections.length).toBeGreaterThan(0)
      for (const s of g.sections) {
        expect(s.heading.trim()).toBeTruthy()
        expect(s.paragraphs.length).toBeGreaterThan(0)
      }
    }
  })

  it('getGuideBySlug trả đúng guide và undefined khi không thấy', () => {
    expect(getGuideBySlug('cach-tai-aoe4')?.slug).toBe('cach-tai-aoe4')
    expect(getGuideBySlug('khong-ton-tai')).toBeUndefined()
  })
})
