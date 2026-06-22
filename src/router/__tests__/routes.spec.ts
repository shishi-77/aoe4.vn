import { describe, it, expect } from 'vitest'
import router from '../index'

describe('routes', () => {
  it('có các route chính', () => {
    const names = router.getRoutes().map((r) => r.name)
    expect(names).toEqual(
      expect.arrayContaining([
        'home',
        'tournaments',
        'tournament-detail',
        'civ-draft',
        'random-picker',
        'not-found',
      ]),
    )
  })

  it('resolve được /tournaments/lac-hong', () => {
    const r = router.resolve('/tournaments/lac-hong')
    expect(r.name).toBe('tournament-detail')
    expect(r.params.slug).toBe('lac-hong')
  })
})
