import { describe, it, expect } from 'vitest'
import {
  tournamentEventJsonLd,
  organizationJsonLd,
  websiteJsonLd,
  guideArticleJsonLd,
  newsArticleJsonLd,
} from '@/lib/structuredData'
import { lacHong } from '@/data/tournaments/lac-hong'
import { downloadGuide } from '@/data/guides/cach-tai-aoe4'
import { site } from '@/data/site'
import type { NewsPost } from '@/data/news'

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

describe('newsArticleJsonLd', () => {
  const post: NewsPost = {
    slug: 'vi-du',
    title: 'Tiêu đề tin',
    description: 'Mô tả tin tức dài hơn hai mươi ký tự.',
    publishedAt: '2026-08-01',
    updatedAt: '2026-08-02',
    sources: [{ label: 'Nguồn', url: 'https://example.com/' }],
    sections: [{ heading: 'H', paragraphs: ['P'] }],
  }

  it('sinh NewsArticle với ngày đăng và ngày sửa', () => {
    const ld = newsArticleJsonLd(post, site)
    expect(ld['@type']).toBe('NewsArticle')
    expect(ld.headline).toBe('Tiêu đề tin')
    expect(ld.datePublished).toBe('2026-08-01')
    expect(ld.dateModified).toBe('2026-08-02')
    expect(ld.mainEntityOfPage).toBe('https://aoe4.vn/news/vi-du/')
  })

  it('dateModified rơi về publishedAt khi không có updatedAt', () => {
    const ld = newsArticleJsonLd({ ...post, updatedAt: undefined }, site)
    expect(ld.dateModified).toBe('2026-08-01')
  })
})

describe('Article được làm giàu cho GEO', () => {
  const postWithSources: NewsPost = {
    slug: 'tin-mau',
    title: 'Tin mẫu',
    description: 'Mô tả tin mẫu.',
    publishedAt: '2026-08-02',
    sources: [{ label: 'Patch notes chính thức', url: 'https://www.ageofempires.com/news/' }],
    sections: [{ heading: 'Nội dung', paragraphs: ['Đoạn.'] }],
  }

  it('guide khai báo ngôn ngữ, thuộc về WebSite và nói về game nào', () => {
    const ld = guideArticleJsonLd(downloadGuide, site)
    expect(ld.inLanguage).toBe('vi-VN')
    expect(ld.isPartOf).toMatchObject({ '@type': 'WebSite', url: `${site.url}/` })
    expect(ld.about).toMatchObject({ '@type': 'VideoGame', name: 'Age of Empires IV' })
  })

  it('news cũng khai báo ba trường đó', () => {
    const ld = newsArticleJsonLd(postWithSources, site)
    expect(ld.inLanguage).toBe('vi-VN')
    expect(ld.isPartOf).toMatchObject({ '@type': 'WebSite' })
    expect(ld.about).toMatchObject({ '@type': 'VideoGame' })
  })

  it('news phát citation kèm nhãn nguồn', () => {
    const ld = newsArticleJsonLd(postWithSources, site)
    expect(ld.citation).toEqual([
      {
        '@type': 'CreativeWork',
        name: 'Patch notes chính thức',
        url: 'https://www.ageofempires.com/news/',
      },
    ])
  })

  it('guide có sources thì phát citation chỉ gồm url', () => {
    const ld = guideArticleJsonLd(
      { ...downloadGuide, sources: ['https://liquipedia.net/ageofempires/'] },
      site,
    )
    expect(ld.citation).toEqual([
      { '@type': 'CreativeWork', url: 'https://liquipedia.net/ageofempires/' },
    ])
  })

  it('guide không có sources thì bỏ hẳn khoá citation, không phát mảng rỗng', () => {
    const ld = guideArticleJsonLd({ ...downloadGuide, sources: undefined }, site)
    expect('citation' in ld).toBe(false)
  })

  it('news có sources rỗng cũng bỏ hẳn khoá citation', () => {
    const ld = newsArticleJsonLd({ ...postWithSources, sources: [] }, site)
    expect('citation' in ld).toBe(false)
  })

  it('author là Organization khi site.author.name rỗng', () => {
    const ld = guideArticleJsonLd(downloadGuide, { ...site, author: { name: '', url: '' } })
    expect(ld.author).toMatchObject({ '@type': 'Organization', name: site.name })
  })

  it('author thành Person khi owner đã điền tên', () => {
    const ld = guideArticleJsonLd(downloadGuide, {
      ...site,
      author: { name: 'Nguyễn Văn A', url: 'https://example.com/a' },
    })
    expect(ld.author).toEqual({
      '@type': 'Person',
      name: 'Nguyễn Văn A',
      url: 'https://example.com/a',
    })
  })

  it('Person bỏ khoá url khi owner chỉ điền tên', () => {
    const ld = guideArticleJsonLd(downloadGuide, {
      ...site,
      author: { name: 'Nguyễn Văn A', url: '' },
    })
    expect(ld.author).toEqual({ '@type': 'Person', name: 'Nguyễn Văn A' })
  })
})
