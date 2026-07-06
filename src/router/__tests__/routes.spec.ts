import { describe, it, expect } from 'vitest'
import router from '@/router'

describe('routes', () => {
  it('có các route chính', () => {
    const names = router.getRoutes().map((r) => r.name)
    expect(names).toEqual(
      expect.arrayContaining([
        'home',
        'tournaments',
        'tournament-detail',
        'not-found',
      ]),
    )
  })

  it('resolve được /tournaments/lac-hong', () => {
    const r = router.resolve('/tournaments/lac-hong')
    expect(r.name).toBe('tournament-detail')
    expect(r.params.slug).toBe('lac-hong')
  })

  it('resolve được /faq', () => {
    const r = router.resolve('/faq')
    expect(r.name).toBe('faq')
  })

  it('resolve được /guides', () => {
    const r = router.resolve('/guides')
    expect(r.name).toBe('guides')
  })

  it('resolve được /guides/cach-tai-aoe4', () => {
    const r = router.resolve('/guides/cach-tai-aoe4')
    expect(r.name).toBe('guide-detail')
    expect(r.params.slug).toBe('cach-tai-aoe4')
  })

  it('resolve được /faq/ có trailing slash', () => {
    expect(router.resolve('/faq/').name).toBe('faq')
  })

  it('resolve được /guides/ có trailing slash', () => {
    expect(router.resolve('/guides/').name).toBe('guides')
  })

  it('resolve được /guides/cach-tai-aoe4/ có trailing slash', () => {
    const r = router.resolve('/guides/cach-tai-aoe4/')
    expect(r.name).toBe('guide-detail')
    expect(r.params.slug).toBe('cach-tai-aoe4')
  })

  it('resolve được /tournaments/lac-hong/ có trailing slash', () => {
    const r = router.resolve('/tournaments/lac-hong/')
    expect(r.name).toBe('tournament-detail')
    expect(r.params.slug).toBe('lac-hong')
  })
})
