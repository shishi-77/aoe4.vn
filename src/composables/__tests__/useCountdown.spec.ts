import { describe, it, expect } from 'vitest'
import { computeCountdown } from '@/composables/useCountdown'

describe('computeCountdown', () => {
  it('breaks a future diff into days/hours/minutes/seconds', () => {
    const now = Date.parse('2026-06-13T13:30:00+07:00')
    const target = Date.parse('2026-06-14T13:30:00+07:00')
    const state = computeCountdown(target, now)
    expect(state).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0, isLive: false })
  })

  it('computes mixed units correctly', () => {
    const now = Date.parse('2026-06-14T11:28:30+07:00')
    const target = Date.parse('2026-06-14T13:30:00+07:00')
    const state = computeCountdown(target, now)
    expect(state).toEqual({ days: 0, hours: 2, minutes: 1, seconds: 30, isLive: false })
  })

  it('reports isLive=true when the target has passed', () => {
    const now = Date.parse('2026-06-14T13:30:01+07:00')
    const target = Date.parse('2026-06-14T13:30:00+07:00')
    const state = computeCountdown(target, now)
    expect(state).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true })
  })

  it('reports isLive=true exactly at the target time', () => {
    const t = Date.parse('2026-06-14T13:30:00+07:00')
    expect(computeCountdown(t, t).isLive).toBe(true)
  })
})
