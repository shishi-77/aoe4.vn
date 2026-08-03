import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { site } from '@/data/site'
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

  it('dùng Facebook làm CTA duy nhất, bỏ Discord và link Trang chủ', () => {
    const wrapper = mount(AppNavbar, mountOptions)

    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).not.toContain(site.links.discord)
    expect(wrapper.text()).not.toContain('Trang chủ')

    const facebookLinks = wrapper.findAll(`a[href="${site.links.facebook}"]`)
    expect(facebookLinks).toHaveLength(1)
    const facebook = facebookLinks[0]
    expect(facebook.classes()).toContain('bg-gold')
    expect(facebook.attributes('target')).toBe('_blank')
    expect(facebook.attributes('rel')).toBe('noopener noreferrer')
  })
})
