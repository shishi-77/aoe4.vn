import { describe, it, expect } from 'vitest'
import { dlc } from '../dlc'
import { site } from '../site'

describe('shared data integrity', () => {
  it('dlc có nhãn release và steam url', () => {
    expect(dlc.releaseLabel).toBeTruthy()
    expect(dlc.steamUrl).toMatch(/^https:\/\/store\.steampowered\.com/)
  })

  it('site có link discord, blog, ahaslides', () => {
    expect(site.links.discord).toBeTruthy()
    expect(site.links.blog).toContain('aoe4vietnam.org')
    expect(site.ahaslides.url).toBeTruthy()
  })
})
