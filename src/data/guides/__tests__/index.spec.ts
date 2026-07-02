import { describe, it, expect } from 'vitest'
import { guides, getGuideBySlug } from '@/data/guides'

describe('guide internal links', () => {
  const allLinks = guides.flatMap((g) => [
    ...(g.related ?? []).map((l) => ({ from: g.slug, l })),
    ...g.sections.flatMap((s) => (s.link ? [{ from: g.slug, l: s.link }] : [])),
  ])

  it('mọi link nội bộ trỏ tới guide có thật và có nhãn', () => {
    expect(allLinks.length).toBeGreaterThan(0)
    for (const { l } of allLinks) {
      expect(l.label.trim()).toBeTruthy()
      expect(getGuideBySlug(l.slug)).toBeDefined()
    }
  })

  it('không guide nào tự link tới chính nó', () => {
    for (const { from, l } of allLinks) {
      expect(l.slug).not.toBe(from)
    }
  })

  it('bài chế độ chơi có khối bài liên quan', () => {
    expect(getGuideBySlug('cac-che-do-choi-aoe4')?.related?.length).toBeGreaterThan(0)
  })

  it('bài tìm người Việt trỏ tới bài chế độ chơi và không lặp lại Quick/Ranked', () => {
    const g = getGuideBySlug('tim-nguoi-viet-choi-aoe4')!
    const linked = g.sections.some((s) => s.link?.slug === 'cac-che-do-choi-aoe4')
    expect(linked).toBe(true)
    const body = g.sections.flatMap((s) => s.paragraphs).join(' ')
    expect(body).not.toContain('Đấu xếp hạng (Ranked)')
  })
})

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

describe('bài trụ aoe4-khac-de-che-the-nao', () => {
  it('tồn tại và có đủ 6 mục', () => {
    const g = getGuideBySlug('aoe4-khac-de-che-the-nao')
    expect(g).toBeDefined()
    expect(g!.sections.length).toBe(6)
  })

  it('bài liên quan trỏ về guide người mới và build order', () => {
    const g = getGuideBySlug('aoe4-khac-de-che-the-nao')!
    const slugs = (g.related ?? []).map((l) => l.slug)
    expect(slugs).toContain('huong-dan-aoe4-nguoi-moi')
    expect(slugs).toContain('build-order-co-ban-aoe4')
  })

  it('chưa gắn link satellite trong section (satellite chưa tồn tại)', () => {
    const g = getGuideBySlug('aoe4-khac-de-che-the-nao')!
    expect(g.sections.every((s) => s.link === undefined)).toBe(true)
  })

  it('không dùng em-dash trong nội dung', () => {
    const g = getGuideBySlug('aoe4-khac-de-che-the-nao')!
    const body = [g.title, g.description, ...g.sections.flatMap((s) => [s.heading, ...s.paragraphs])].join(' ')
    expect(body).not.toContain('—')
  })
})
