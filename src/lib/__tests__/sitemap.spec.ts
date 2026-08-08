import { describe, it, expect } from 'vitest'
import { buildSitemapXml } from '@/lib/sitemap'
import type { Guide } from '@/data/guides'
import type { NewsPost } from '@/data/news'

const guide = (slug: string, updatedAt: string): Guide => ({
  slug,
  title: 't',
  description: 'd',
  updatedAt,
  sections: [],
})

const post = (slug: string, publishedAt: string, updatedAt?: string): NewsPost => ({
  slug,
  title: 't',
  description: 'd',
  publishedAt,
  updatedAt,
  sources: [{ label: 's', url: 'https://example.com/' }],
  sections: [],
})

describe('buildSitemapXml', () => {
  const guides = [guide('a', '2026-06-28'), guide('b', '2026-07-02')]

  it('phát lastmod cho từng guide từ updatedAt', () => {
    const xml = buildSitemapXml('https://aoe4.vn', guides, [])
    expect(xml).toContain(
      '<url><loc>https://aoe4.vn/guides/a/</loc><lastmod>2026-06-28</lastmod></url>',
    )
    expect(xml).toContain(
      '<url><loc>https://aoe4.vn/guides/b/</loc><lastmod>2026-07-02</lastmod></url>',
    )
  })

  it('dùng ngày guide mới nhất cho /guides/', () => {
    const xml = buildSitemapXml('https://aoe4.vn', guides, [])
    expect(xml).toContain(
      '<url><loc>https://aoe4.vn/guides/</loc><lastmod>2026-07-02</lastmod></url>',
    )
  })

  it('không phát lastmod cho trang không có ngày', () => {
    const xml = buildSitemapXml('https://aoe4.vn', guides, [])
    expect(xml).toContain('<url><loc>https://aoe4.vn/faq/</loc></url>')
    expect(xml).not.toContain('/faq/</loc><lastmod>')
  })

  it('bắt đầu bằng khai báo xml và urlset', () => {
    const xml = buildSitemapXml('https://aoe4.vn', guides, [])
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  })

  it('liệt kê trang công cụ', () => {
    const xml = buildSitemapXml('https://aoe4.vn', [], [])
    expect(xml).toContain('<loc>https://aoe4.vn/tools/</loc>')
  })
})

describe('buildSitemapXml - news', () => {
  const news = [post('tin-a', '2026-08-01'), post('tin-b', '2026-08-02', '2026-08-03')]

  it('phát entry từng bài tin, lastmod ưu tiên updatedAt', () => {
    const xml = buildSitemapXml('https://aoe4.vn', [], news)
    expect(xml).toContain(
      '<url><loc>https://aoe4.vn/news/tin-a/</loc><lastmod>2026-08-01</lastmod></url>',
    )
    expect(xml).toContain(
      '<url><loc>https://aoe4.vn/news/tin-b/</loc><lastmod>2026-08-03</lastmod></url>',
    )
  })

  it('dùng ngày mới nhất cho /news/', () => {
    const xml = buildSitemapXml('https://aoe4.vn', [], news)
    expect(xml).toContain(
      '<url><loc>https://aoe4.vn/news/</loc><lastmod>2026-08-03</lastmod></url>',
    )
  })

  it('không phát /news/ khi chưa có bài tin', () => {
    const xml = buildSitemapXml('https://aoe4.vn', [], [])
    expect(xml).not.toContain('/news/')
  })
})
