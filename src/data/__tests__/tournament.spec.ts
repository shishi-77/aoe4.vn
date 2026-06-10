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
    expect(tournament.links.discord).toBe('https://discord.gg/Tzc8rnRk')
    expect(tournament.links.banPick).toBe('https://aoe2cm.net/preset/QHani')
    expect(tournament.links.mapPool).toBe('https://aoe2cm.net/preset/MivJN')
    expect(tournament.links.youtube).toBe('https://www.youtube.com/@clearmanaoe4')
  })
})
