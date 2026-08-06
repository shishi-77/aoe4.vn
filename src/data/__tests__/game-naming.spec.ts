import { describe, it, expect } from 'vitest'
import { guides } from '@/data/guides'
import { newsPosts } from '@/data/news'
import { faqItems } from '@/data/faq'
import { gameNamingFailures } from '@/lib/gameNaming'
import { guideProse, newsProse } from '@/lib/seoAudit'

/**
 * Hard gate for the house naming convention (CLAUDE.md): reader-facing prose names
 * games in Vietnamese. Titles and descriptions are excluded on purpose - they are the
 * technical zone where abbreviations carry search traffic.
 */
describe('game naming convention', () => {
  it.each(guides.map((g) => [g.slug, g] as const))('guide %s names games consistently', (_, g) => {
    expect(gameNamingFailures(guideProse(g))).toEqual([])
  })

  it.each(newsPosts.map((p) => [p.slug, p] as const))(
    'news %s names games consistently',
    (_, p) => {
      expect(gameNamingFailures(newsProse(p))).toEqual([])
    },
  )

  it('FAQ names games consistently', () => {
    expect(gameNamingFailures(faqItems.flatMap((f) => [f.question, f.answer]))).toEqual([])
  })
})
