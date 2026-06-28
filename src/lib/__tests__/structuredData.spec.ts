import { describe, it, expect } from 'vitest'
import {
  tournamentEventJsonLd,
  organizationJsonLd,
  websiteJsonLd,
  guideArticleJsonLd,
} from '@/lib/structuredData'
import { lacHong } from '@/data/tournaments/lac-hong'
import { downloadGuide } from '@/data/guides/cach-tai-aoe4'
import { site } from '@/data/site'

describe('tournamentEventJsonLd', () => {
  const ld = tournamentEventJsonLd(lacHong, site)

  it('là một SportsEvent hợp lệ với context schema.org', () => {
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toBe('SportsEvent')
    expect(ld.name).toBe(lacHong.name)
  })

  it('dùng ngày bắt đầu/kết thúc ISO của giải', () => {
    expect(ld.startDate).toBe(lacHong.startsAt)
    expect(ld.endDate).toBe(lacHong.endsAt)
  })

  it('url và image trỏ về đúng trang giải (tuyệt đối)', () => {
    expect(ld.url).toBe(`${site.url}/tournaments/${lacHong.slug}/`)
    expect(String(ld.image)).toContain(site.url)
  })

  it('image dùng ogImage riêng của giải (không phải og.jpg mặc định)', () => {
    expect(ld.image).toBe(`${site.url}${lacHong.ogImage}`)
    expect(String(ld.image)).not.toMatch(/\/og\.jpg$/)
  })

  it('image fallback về banner khi giải không có ogImage', () => {
    const noOg = { ...lacHong, ogImage: undefined }
    const fallback = tournamentEventJsonLd(noOg, site)
    expect(fallback.image).toBe(`${site.url}${lacHong.banner}`)
  })

  it('location là Place với tên và địa chỉ venue', () => {
    const loc = ld.location as Record<string, unknown>
    expect(loc['@type']).toBe('Place')
    expect(loc.name).toBe(lacHong.venue.name)
    expect(loc.address).toBe(lacHong.venue.address)
  })

  // GSC: 3 trường còn thiếu cần bổ sung
  it('có "description" không rỗng', () => {
    expect(typeof ld.description).toBe('string')
    expect(String(ld.description).length).toBeGreaterThan(20)
  })

  it('có "performer" dạng PerformingGroup', () => {
    const performer = ld.performer as Record<string, unknown>
    expect(performer['@type']).toBe('PerformingGroup')
    expect(String(performer.name).trim()).toBeTruthy()
  })

  it('có "offers" với giá, tiền tệ và link đăng ký', () => {
    const offers = ld.offers as Record<string, unknown>
    expect(offers['@type']).toBe('Offer')
    expect(offers.price).toBe('0') // Miễn phí
    expect(offers.priceCurrency).toBe('VND')
    expect(offers.availability).toBe('https://schema.org/InStock')
    expect(String(offers.url)).toBeTruthy()
    expect(offers.validThrough).toBe(lacHong.registrationClosesAt)
  })

  it('có organizer với tên và url', () => {
    const org = ld.organizer as Record<string, unknown>
    expect(org['@type']).toBe('Organization')
    expect(org.name).toBe(lacHong.organizer)
    expect(String(org.url)).toBeTruthy()
  })
})

describe('organizationJsonLd', () => {
  const ld = organizationJsonLd(site)

  it('là Organization với tên, url và logo của site', () => {
    expect(ld['@type']).toBe('Organization')
    expect(ld.name).toBe(site.name)
    expect(ld.url).toBe(`${site.url}/`)
    expect(String(ld.logo)).toContain(site.url)
  })

  it('liệt kê sameAs từ các kênh mạng xã hội', () => {
    const sameAs = ld.sameAs as string[]
    expect(Array.isArray(sameAs)).toBe(true)
    expect(sameAs).toContain(site.links.discord)
    expect(sameAs).toContain(site.links.facebook)
    expect(sameAs).toContain(site.links.youtube)
  })
})

describe('websiteJsonLd', () => {
  const ld = websiteJsonLd(site)

  it('là WebSite với tên và url', () => {
    expect(ld['@type']).toBe('WebSite')
    expect(ld.name).toBe(site.name)
    expect(ld.url).toBe(`${site.url}/`)
  })
})

describe('guideArticleJsonLd', () => {
  it('tạo schema Article hợp lệ với canonical có dấu / cuối', () => {
    const ld = guideArticleJsonLd(downloadGuide, site) as Record<string, unknown>
    expect(ld['@type']).toBe('Article')
    expect(ld.headline).toBe(downloadGuide.title)
    expect(ld.mainEntityOfPage).toBe(`${site.url}/guides/${downloadGuide.slug}/`)
    expect(ld.datePublished).toBe(downloadGuide.updatedAt)
  })
})
