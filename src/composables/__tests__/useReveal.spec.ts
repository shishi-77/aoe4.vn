import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useReveal } from '@/composables/useReveal'

type IOCallback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void

describe('useReveal', () => {
  let lastCallback: IOCallback | undefined
  let observed: Element[]
  let unobserved: Element[]

  beforeEach(() => {
    observed = []
    unobserved = []
    lastCallback = undefined
    class FakeIO {
      constructor(cb: IOCallback) {
        lastCallback = cb
      }
      observe(node: Element) {
        observed.push(node)
      }
      unobserve(node: Element) {
        unobserved.push(node)
      }
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', FakeIO)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function mountHost() {
    const Host = defineComponent({
      setup() {
        const { el } = useReveal()
        return () => h('div', { ref: el, class: 'reveal' })
      },
    })
    return mount(Host, { attachTo: document.body })
  }

  it('observe phần tử khi mount', () => {
    const wrapper = mountHost()
    expect(observed.length).toBe(1)
    expect(observed[0]).toBe(wrapper.element)
    wrapper.unmount()
  })

  it('thêm is-visible và unobserve khi phần tử vào viewport', () => {
    const wrapper = mountHost()
    lastCallback?.([{ isIntersecting: true, target: wrapper.element }])
    expect(wrapper.element.classList.contains('is-visible')).toBe(true)
    expect(unobserved).toContain(wrapper.element)
    wrapper.unmount()
  })

  it('không thêm is-visible khi chưa giao nhau', () => {
    const wrapper = mountHost()
    lastCallback?.([{ isIntersecting: false, target: wrapper.element }])
    expect(wrapper.element.classList.contains('is-visible')).toBe(false)
    wrapper.unmount()
  })
})
