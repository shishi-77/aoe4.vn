import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useParallax } from '../useParallax'

const Host = defineComponent({
  setup() {
    const { el } = useParallax()
    return { el }
  },
  template: '<div ref="el"></div>',
})

function setMatchMedia(reduced: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true })
}

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  setScrollY(0)
})

describe('useParallax', () => {
  it('ghi scrollY vào --scroll khi cuộn (motion cho phép)', async () => {
    setMatchMedia(false)
    wrapper = mount(Host)
    setScrollY(120)
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.element.style.getPropertyValue('--scroll')).toBe('120')
  })

  it('không ghi gì khi prefers-reduced-motion', async () => {
    setMatchMedia(true)
    wrapper = mount(Host)
    setScrollY(120)
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.element.style.getPropertyValue('--scroll')).toBe('')
  })

  it('xóa listener khi unmount, không còn cập nhật --scroll', async () => {
    setMatchMedia(false)
    wrapper = mount(Host)
    const el = wrapper.element as HTMLElement
    wrapper.unmount()
    wrapper = undefined
    setScrollY(200)
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(el.style.getPropertyValue('--scroll')).not.toBe('200')
  })
})
