import { describe, it, expect } from 'vitest'
import type { Guide } from '@/data/guides'
import { scoreGuideSeo, normalizeVi, seoHygiene } from '@/lib/guideSeo'

const goodGuide: Guide = {
  slug: 'cung-r-ngua-chem-aoe4',
  title: 'Cung R, ngựa chém, lạc đà: dân Đế chế mê tốc độ chơi lính gì ở AoE4 (Đế chế 4)?',
  description:
    'Cung R, ngựa chém hay lạc đà của Đế chế sang Đế chế 4 là lính nào? Bản đồ lính cho dân Đế chế mê đánh nhanh, đủ dài để mô tả tốt.',
  updatedAt: '2026-07-03',
  cta: true,
  sections: [
    { heading: 'Mở', paragraphs: ['Một đoạn.'], link: { slug: 'aoe4-khac-de-che-the-nao', label: 'x' } },
  ],
  related: [{ slug: 'aoe4-khac-de-che-the-nao', label: 'y' }],
}

const badGuide: Guide = {
  slug: 'Bad Slug',
  title: 'x',
  description: 'ngắn',
  updatedAt: '2026-07-03',
  cta: false,
  sections: [{ heading: 'H', paragraphs: ['p'] }],
}

describe('normalizeVi', () => {
  it('bỏ dấu và đổi đ thành d', () => {
    expect(normalizeVi('Đế chế ngựa')).toBe('de che ngua')
  })
})

describe('scoreGuideSeo', () => {
  it('bài tốt đạt điểm chiều SEO ≥ 7', () => {
    const r = scoreGuideSeo(goodGuide)
    expect(r.dimensionScore).toBeGreaterThanOrEqual(7)
    expect(r.slug).toBe('cung-r-ngua-chem-aoe4')
  })

  it('bài dở đạt điểm chiều SEO < 4', () => {
    expect(scoreGuideSeo(badGuide).dimensionScore).toBeLessThan(4)
  })

  it('nhận diện thiếu internal link', () => {
    const r = scoreGuideSeo(badGuide)
    const link = r.rules.find((x) => x.id === 'internal-link')!
    expect(link.points).toBe(0)
  })

  it('cho điểm slug không dấu và trừ slug có dấu/khoảng trắng', () => {
    expect(scoreGuideSeo(goodGuide).rules.find((x) => x.id === 'slug-clean')!.points).toBe(1)
    expect(scoreGuideSeo(badGuide).rules.find((x) => x.id === 'slug-clean')!.points).toBe(0)
  })

  it('điểm chiều nằm trong [0,10]', () => {
    for (const g of [goodGuide, badGuide]) {
      const s = scoreGuideSeo(g).dimensionScore
      expect(s).toBeGreaterThanOrEqual(0)
      expect(s).toBeLessThanOrEqual(10)
    }
  })

  it('title ở dải chấp nhận (không phải dải ideal) chỉ được nửa điểm', () => {
    const tolerantTitleGuide: Guide = {
      ...badGuide,
      slug: 'aoe4-khac-de-che-the-nao',
      // Độ dài 90 ký tự: nằm trong dải chấp nhận [20,100] nhưng ngoài dải ideal [30,80].
      title: 'A'.repeat(90),
    }
    expect(tolerantTitleGuide.title.length).toBe(90)
    const r = scoreGuideSeo(tolerantTitleGuide)
    expect(r.rules.find((x) => x.id === 'title-length')!.points).toBe(1)
  })

  it('description ở dải chấp nhận chỉ được nửa điểm', () => {
    const tolerantDescGuide: Guide = {
      ...badGuide,
      slug: 'aoe4-khac-de-che-the-nao',
      // Độ dài 60 ký tự: nằm trong dải chấp nhận [50,260] nhưng ngoài dải ideal [70,210].
      description: 'B'.repeat(60),
    }
    expect(tolerantDescGuide.description.length).toBe(60)
    const r = scoreGuideSeo(tolerantDescGuide)
    expect(r.rules.find((x) => x.id === 'description-length')!.points).toBe(1)
  })

  it('title chỉ khớp một phần từ khóa slug thì được điểm phân số', () => {
    const partialCoverageGuide: Guide = {
      ...badGuide,
      slug: 'cung-ngua-lacda-aoe4',
      title: 'Cung R và ngựa chém mạnh nhất bản đồ',
      description: 'ngắn',
    }
    const r = scoreGuideSeo(partialCoverageGuide)
    // token 'lacda' không xuất hiện trong title => coverage 2/3, làm tròn còn 0.7.
    expect(r.rules.find((x) => x.id === 'keyword-in-title')!.points).toBe(0.7)
  })
})

describe('seoHygiene', () => {
  const healthy: Guide = {
    slug: 'cung-r-ngua-chem-aoe4',
    title: 'Cung R, ngựa chém, lạc đà: dân Đế chế mê tốc độ chơi lính gì ở AoE4?',
    description:
      'Bản đồ lính cho dân Đế chế mê đánh nhanh sang AoE4, đủ dài để mô tả cho tốt và rõ ràng.',
    updatedAt: '2026-07-03',
    cta: true,
    sections: [{ heading: 'H', paragraphs: ['p'], link: { slug: 'x', label: 'y' } }],
    related: [{ slug: 'x', label: 'y' }],
  }

  it('bài đủ vệ sinh thì pass, không có failure', () => {
    const r = seoHygiene(healthy)
    expect(r.pass).toBe(true)
    expect(r.failures).toEqual([])
  })

  it('thiếu link, cta, title quá ngắn -> fail và liệt kê từng lỗi', () => {
    const broken: Guide = {
      slug: 'x',
      title: 'x',
      description: 'Mô tả dài hơn năm mươi ký tự để không dính lỗi độ dài mô tả nhé.',
      updatedAt: '2026-07-06',
      cta: false,
      sections: [{ heading: 'H', paragraphs: ['p'] }],
    }
    const r = seoHygiene(broken)
    expect(r.pass).toBe(false)
    expect(r.failures.length).toBeGreaterThanOrEqual(3)
    expect(r.failures.some((f) => f.includes('internal link'))).toBe(true)
    expect(r.failures.some((f) => f.includes('cta'))).toBe(true)
    expect(r.failures.some((f) => f.includes('title'))).toBe(true)
  })

  it('mô tả quá ngắn bị bắt', () => {
    expect(seoHygiene({ ...healthy, description: 'ngắn' }).pass).toBe(false)
  })
})
