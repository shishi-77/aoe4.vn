import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HeroBackdrop from '../HeroBackdrop.vue'

describe('HeroBackdrop', () => {
  it('render hai lớp sóng và thuyền longship', () => {
    const wrapper = mount(HeroBackdrop)
    expect(wrapper.find('.wave-back').exists()).toBe(true)
    expect(wrapper.find('.wave-front').exists()).toBe(true)
    expect(wrapper.find('svg.ship-bob').exists()).toBe(true)
  })

  it('render dải trời aurora và ít nhất một rune', () => {
    const wrapper = mount(HeroBackdrop)
    expect(wrapper.find('.aurora').exists()).toBe(true)
    expect(wrapper.findAll('.rune').length).toBeGreaterThan(0)
  })

  it('bọc các lớp trong wrapper parallax sky và sea', () => {
    const wrapper = mount(HeroBackdrop)
    expect(wrapper.find('.parallax-sky').exists()).toBe(true)
    expect(wrapper.find('.parallax-sea').exists()).toBe(true)
  })

  it('lớp trang trí được ẩn khỏi screen reader', () => {
    const wrapper = mount(HeroBackdrop)
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
    expect(wrapper.find('img').attributes('alt')).toBe('')
  })
})
