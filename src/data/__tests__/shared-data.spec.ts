import { describe, it, expect } from 'vitest'
import { dlc } from '../dlc'
import { site } from '../site'

describe('shared data integrity', () => {
  it('dlc có nhãn release và steam url', () => {
    expect(dlc.releaseLabel).toBeTruthy()
    expect(dlc.steamUrl).toMatch(/^https:\/\/store\.steampowered\.com/)
  })

  it('dlc có ngày dự đoán hợp lệ (ISO +07:00)', () => {
    expect(dlc.predictedReleaseDate).toBe('2026-11-10T00:00:00+07:00')
    expect(Number.isNaN(Date.parse(dlc.predictedReleaseDate ?? ''))).toBe(false)
  })

  it('site có link discord, blog, ahaslides', () => {
    expect(site.links.discord).toBeTruthy()
    expect(site.links.blog).toContain('aoe4vietnam.org')
    expect(site.ahaslides.url).toBeTruthy()
  })
})
