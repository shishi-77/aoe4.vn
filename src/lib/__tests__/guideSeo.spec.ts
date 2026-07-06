import { describe, it, expect } from 'vitest'
import type { Guide } from '@/data/guides'
import { scoreGuideSeo, normalizeVi } from '@/lib/guideSeo'

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
})
