import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import NorseDivider from '../NorseDivider.vue'

describe('NorseDivider', () => {
  it('render svg trang trí với class norse-divider', () => {
    const wrapper = mount(NorseDivider)
    expect(wrapper.find('svg.norse-divider').exists()).toBe(true)
  })

  it('ẩn khỏi screen reader', () => {
    const wrapper = mount(NorseDivider)
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })
})
