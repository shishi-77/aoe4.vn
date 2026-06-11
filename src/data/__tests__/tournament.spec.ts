import { describe, it, expect } from 'vitest'
import { tournament } from '@/data/tournament'

describe('tournament data', () => {
  it('has the correct name and format', () => {
    expect(tournament.name).toBe('Lạc Hồng Cup')
    expect(tournament.format).toBe('4vs4')
  })

  it('starts on 2026-06-14 13:30 +07:00', () => {
    expect(tournament.startsAt).toBe('2026-06-14T13:30:00+07:00')
  })

  it('has a consistent timeline: registration closes before start, start before end', () => {
    const closes = new Date(tournament.registrationClosesAt).getTime()
    const starts = new Date(tournament.startsAt).getTime()
    const ends = new Date(tournament.endsAt).getTime()
    expect(closes).toBeLessThan(starts)
    expect(starts).toBeLessThan(ends)
  })

  it('links the venue to Google Maps', () => {
    expect(tournament.venue.mapsUrl).toMatch(/^https:\/\/www\.google\.com\/maps\//)
  })

  it('lists exactly 6 prizes with correct amounts', () => {
    expect(tournament.prizes).toHaveLength(6)
    expect(tournament.prizes.map((p) => p.amount)).toEqual([
      '1.000.000đ',
      '700.000đ',
      '500.000đ',
      '360.000đ',
      '240.000đ',
      '200.000đ',
    ])
    expect(tournament.prizes[0].note).toContain('cúp')
    expect(tournament.prizes[0].medal).toBe('🥇')
  })

  it('lists exactly 9 maps', () => {
    expect(tournament.maps).toHaveLength(9)
    expect(tournament.maps).toContain('Dry Arabia')
    expect(tournament.maps).toContain('Sunkenland')
  })

  it('has the correct external links', () => {
    expect(tournament.links.discord).toBe('https://discord.gg/Bshbqw7nHN')
    expect(tournament.links.banPick).toBe('https://aoe2cm.net/preset/QHani')
    expect(tournament.links.mapPool).toBe('https://aoe2cm.net/preset/MivJN')
    expect(tournament.links.youtube).toBe('https://www.youtube.com/@clearmanaoe4')
  })

  it('has a human-readable date label', () => {
    expect(tournament.dateLabel).toBe('Chủ Nhật, 14/06/2026 · 13h30')
  })
})
