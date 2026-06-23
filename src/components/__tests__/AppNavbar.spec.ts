import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AppNavbar from '../AppNavbar.vue'

const mountOptions = {
  global: {
    stubs: { RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } },
  },
}

describe('AppNavbar', () => {
  it('hiển thị logo trong brand link về trang chủ', () => {
    const wrapper = mount(AppNavbar, mountOptions)
    const brand = wrapper.get('a[href="/"]')
    const img = brand.get('img')
    expect(img.attributes('src')).toBe('/favicon.webp')
    expect(img.attributes('alt')).toBe('')
    expect(img.attributes('width')).toBe('32')
    expect(img.attributes('height')).toBe('32')
    expect(brand.text()).toContain('AoE4 VN')
  })
})
