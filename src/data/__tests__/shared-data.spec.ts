import { describe, it, expect } from 'vitest'
import { dlc } from '../dlc'
import { site } from '../site'

describe('shared data integrity', () => {
  it('dlc có nhãn release và steam url', () => {
    expect(dlc.releaseLabel).toBeTruthy()
    expect(dlc.steamUrl).toMatch(/^https:\/\/store\.steampowered\.com/)
  })

  it('dlc có ngày phát hành chính thức hợp lệ (ISO +07:00)', () => {
    expect(dlc.releaseDate).toBe('2026-10-30T00:00:00+07:00')
    expect(dlc.predictedReleaseDate).toBeNull()
    expect(Number.isNaN(Date.parse(dlc.releaseDate ?? ''))).toBe(false)
  })

  it('site có link discord, blog, ahaslides', () => {
    expect(site.links.discord).toBeTruthy()
    expect(site.links.blog).toContain('aoe4vietnam.org')
    expect(site.ahaslides.url).toBeTruthy()
  })
})
