import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { computeCountdown, useCountdown } from '@/composables/useCountdown'

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

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  function mountWith(targetIso: string) {
    const Host = defineComponent({
      setup() {
        return useCountdown(targetIso)
      },
      template: '<div />',
    })
    return mount(Host)
  }

  it('populates refs on mount for a future target', () => {
    vi.setSystemTime(new Date('2026-06-13T13:30:00+07:00'))
    const wrapper = mountWith('2026-06-14T13:30:00+07:00')
    expect(wrapper.vm.days).toBe(1)
    expect(wrapper.vm.isLive).toBe(false)
    wrapper.unmount()
  })

  it('is live and does not keep ticking when target is already past at mount', () => {
    vi.setSystemTime(new Date('2026-06-15T00:00:00+07:00'))
    const wrapper = mountWith('2026-06-14T13:30:00+07:00')
    expect(wrapper.vm.isLive).toBe(true)
    // advancing time must not throw or change the live state
    vi.advanceTimersByTime(5000)
    expect(wrapper.vm.isLive).toBe(true)
    expect(wrapper.vm.days).toBe(0)
    wrapper.unmount()
  })
})
