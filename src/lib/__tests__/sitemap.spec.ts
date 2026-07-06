import { describe, it, expect } from 'vitest'
import { buildSitemapXml } from '@/lib/sitemap'
import type { Guide } from '@/data/guides'

const guide = (slug: string, updatedAt: string): Guide => ({
  slug,
  title: 't',
  description: 'd',
  updatedAt,
  sections: [],
})

describe('buildSitemapXml', () => {
  const guides = [guide('a', '2026-06-28'), guide('b', '2026-07-02')]

  it('phát lastmod cho từng guide từ updatedAt', () => {
    const xml = buildSitemapXml('https://aoe4.vn', guides)
    expect(xml).toContain(
      '<url><loc>https://aoe4.vn/guides/a/</loc><lastmod>2026-06-28</lastmod></url>',
    )
    expect(xml).toContain(
      '<url><loc>https://aoe4.vn/guides/b/</loc><lastmod>2026-07-02</lastmod></url>',
    )
  })

  it('dùng ngày guide mới nhất cho /guides/', () => {
    const xml = buildSitemapXml('https://aoe4.vn', guides)
    expect(xml).toContain(
      '<url><loc>https://aoe4.vn/guides/</loc><lastmod>2026-07-02</lastmod></url>',
    )
  })

  it('không phát lastmod cho trang không có ngày', () => {
    const xml = buildSitemapXml('https://aoe4.vn', guides)
    expect(xml).toContain('<url><loc>https://aoe4.vn/faq/</loc></url>')
    expect(xml).not.toContain('/faq/</loc><lastmod>')
  })

  it('bắt đầu bằng khai báo xml và urlset', () => {
    const xml = buildSitemapXml('https://aoe4.vn', guides)
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  })
})
