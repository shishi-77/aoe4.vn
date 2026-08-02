import { describe, it, expect } from 'vitest'
import { newsSeoHygiene } from '@/lib/newsSeo'
import type { NewsPost } from '@/data/news'

const post = (over: Partial<NewsPost> = {}): NewsPost => ({
  slug: 'ban-tin-vi-du',
  title: 'Bản tin ví dụ về Đế chế 4 tháng 8',
  description: 'Mô tả bản tin dài quá năm mươi ký tự để qua được cổng vệ sinh SEO của news.',
  publishedAt: '2026-08-02',
  cta: true,
  sources: [{ label: 'Nguồn chính thức', url: 'https://www.ageofempires.com/news/' }],
  sections: [{ heading: 'Mục', paragraphs: ['Đoạn.'] }],
  ...over,
})

describe('newsSeoHygiene', () => {
  it('bài chuẩn qua cổng', () => {
    expect(newsSeoHygiene(post())).toEqual({ pass: true, failures: [] })
  })

  it('không có nguồn -> fail (quy tắc truy vết news)', () => {
    const h = newsSeoHygiene(post({ sources: [] }))
    expect(h.pass).toBe(false)
    expect(h.failures.some((f) => f.includes('source'))).toBe(true)
  })

  it('nguồn không phải https -> fail', () => {
    const h = newsSeoHygiene(post({ sources: [{ label: 'x', url: 'http://x.com/' }] }))
    expect(h.pass).toBe(false)
  })

  it('title/description/slug/cta/publishedAt sai -> fail kèm lý do', () => {
    expect(newsSeoHygiene(post({ title: 'Ngắn' })).pass).toBe(false)
    expect(newsSeoHygiene(post({ description: 'ngắn' })).pass).toBe(false)
    expect(newsSeoHygiene(post({ slug: 'Có Dấu' })).pass).toBe(false)
    expect(newsSeoHygiene(post({ cta: undefined })).pass).toBe(false)
    expect(newsSeoHygiene(post({ publishedAt: '2/8/2026' })).pass).toBe(false)
  })
})
