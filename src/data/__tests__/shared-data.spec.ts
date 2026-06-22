import { describe, it, expect } from 'vitest'
import { civs } from '../civs'
import { maps } from '../maps'
import { dlc } from '../dlc'
import { site } from '../site'

describe('shared data integrity', () => {
  it('civ id duy nhất, không rỗng', () => {
    const ids = civs.map((c) => c.id)
    expect(ids.every(Boolean)).toBe(true)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('có civ sắp ra (Vikings/Scots) đánh dấu upcoming', () => {
    const upcoming = civs.filter((c) => c.upcoming).map((c) => c.name)
    expect(upcoming).toEqual(expect.arrayContaining(['Vikings', 'Scots']))
  })

  it('map id duy nhất', () => {
    const ids = maps.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

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
