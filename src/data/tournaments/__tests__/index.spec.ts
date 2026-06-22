import { describe, it, expect } from 'vitest'
import { tournaments, getTournamentBySlug } from '../index'

describe('tournaments collection', () => {
  it('có ít nhất một giải', () => {
    expect(tournaments.length).toBeGreaterThan(0)
  })

  it('slug là duy nhất và không rỗng', () => {
    const slugs = tournaments.map((t) => t.slug)
    expect(slugs.every((s) => s.length > 0)).toBe(true)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('mọi giải có các field bắt buộc', () => {
    for (const t of tournaments) {
      expect(t.name).toBeTruthy()
      expect(t.startsAt).toMatch(/\+07:00$/)
      expect(Array.isArray(t.prizes)).toBe(true)
      expect(Array.isArray(t.maps)).toBe(true)
    }
  })

  it('getTournamentBySlug trả đúng giải và undefined khi không thấy', () => {
    expect(getTournamentBySlug('lac-hong')?.name).toBe('Lạc Hồng Cup')
    expect(getTournamentBySlug('khong-ton-tai')).toBeUndefined()
  })
})
