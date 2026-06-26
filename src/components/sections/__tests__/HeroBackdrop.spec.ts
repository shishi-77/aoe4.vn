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

  it('lớp trang trí được ẩn khỏi screen reader', () => {
    const wrapper = mount(HeroBackdrop)
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
    // ảnh key art không có alt mô tả (trang trí)
    expect(wrapper.find('img').attributes('alt')).toBe('')
  })
})
